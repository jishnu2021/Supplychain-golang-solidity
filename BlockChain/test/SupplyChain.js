const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("SupplyChain", function () {
  let SupplyChain;
  let supplyChain;
  let owner, manager, operator, viewer, noRole;
  let MANAGER_ROLE, OPERATOR_ROLE, VIEWER_ROLE;

  beforeEach(async function () {
    // Get contract factory
    SupplyChain = await ethers.getContractFactory("SupplyChain");
    
    // Get signers
    [owner, manager, operator, viewer, noRole] = await ethers.getSigners();
    
    // Deploy contract
    supplyChain = await SupplyChain.deploy();
    
    // Define role hashes
    MANAGER_ROLE = ethers.keccak256(ethers.toUtf8Bytes("MANAGER_ROLE"));
    OPERATOR_ROLE = ethers.keccak256(ethers.toUtf8Bytes("OPERATOR_ROLE"));
    VIEWER_ROLE = ethers.keccak256(ethers.toUtf8Bytes("VIEWER_ROLE"));
  });

  describe("Role Management", function () {
    it("should set the deployer as admin and manager", async function () {
      const DEFAULT_ADMIN_ROLE = ethers.ZeroHash;
      const isAdmin = await supplyChain.hasRole(DEFAULT_ADMIN_ROLE, owner.address);
      const isManager = await supplyChain.hasRole(MANAGER_ROLE, owner.address);
      
      expect(isAdmin).to.equal(true, "Owner should have admin role");
      expect(isManager).to.equal(true, "Owner should have manager role");
    });

    it("should allow manager to assign roles", async function () {
      await supplyChain.assignRole(manager.address, "MANAGER");
      await supplyChain.assignRole(operator.address, "OPERATOR");
      await supplyChain.assignRole(viewer.address, "VIEWER");

      const managerRole = await supplyChain.connect(manager).checkMyRole();
      const operatorRole = await supplyChain.connect(operator).checkMyRole();
      const viewerRole = await supplyChain.connect(viewer).checkMyRole();
      const noRoleStatus = await supplyChain.connect(noRole).checkMyRole();

      expect(managerRole).to.equal("MANAGER", "Manager role not assigned correctly");
      expect(operatorRole).to.equal("OPERATOR", "Operator role not assigned correctly");
      expect(viewerRole).to.equal("VIEWER", "Viewer role not assigned correctly");
      expect(noRoleStatus).to.equal("NO ROLE", "No role should return NO ROLE");
    });

    it("should fail if non-manager tries to assign roles", async function () {
      await supplyChain.assignRole(operator.address, "OPERATOR");
      
      await expect(
        supplyChain.connect(operator).assignRole(viewer.address, "VIEWER")
      ).to.be.reverted;
    });

    it("should fail if trying to assign invalid role", async function () {
      await expect(
        supplyChain.assignRole(viewer.address, "INVALID_ROLE")
      ).to.be.revertedWith("Invalid role");
    });
  });

  describe("Product Management", function () {
    beforeEach(async function () {
      // Setup roles
      await supplyChain.assignRole(operator.address, "OPERATOR");
      await supplyChain.assignRole(viewer.address, "VIEWER");
    });

    it("should allow operator to add products", async function () {
      const tx = await supplyChain.connect(operator).addProduct("Test Product", "Warehouse A", "In Stock");
      const productId = 1; // First product should have ID 1
      
      // Check event was emitted
      await expect(tx)
        .to.emit(supplyChain, "ProductAdded")
        .withArgs(productId, "Test Product", operator.address);
      
      // Verify product was added correctly
      const product = await supplyChain.products(productId);
      expect(product.id).to.equal(1, "Product ID incorrect");
      expect(product.name).to.equal("Test Product", "Product name incorrect");
      expect(product.location).to.equal("Warehouse A", "Product location incorrect");
      expect(product.status).to.equal("In Stock", "Product status incorrect");
      expect(product.addedBy).to.equal(operator.address, "Product addedBy incorrect");
    });

    it("should allow operator to update products", async function () {
      // First add a product
      await supplyChain.connect(operator).addProduct("Test Product", "Warehouse A", "In Stock");
      const productId = 1;
      
      // Update the product
      const tx = await supplyChain.connect(operator).updateProduct(productId, "Shipped", "In Transit");
      
      // Check event was emitted
      await expect(tx)
        .to.emit(supplyChain, "ProductUpdated")
        .withArgs(productId, "Shipped", "In Transit");
      
      // Verify product was updated correctly
      const product = await supplyChain.products(productId);
      expect(product.status).to.equal("Shipped", "Product status not updated");
      expect(product.location).to.equal("In Transit", "Product location not updated");
    });

    it("should fail if non-operator tries to add products", async function () {
      await expect(
        supplyChain.connect(viewer).addProduct("Test Product", "Warehouse A", "In Stock")
      ).to.be.reverted;
    });

    it("should fail if non-operator tries to update products", async function () {
      // First add a product
      await supplyChain.connect(operator).addProduct("Test Product", "Warehouse A", "In Stock");
      const productId = 1;
      
      // Try to update with non-operator
      await expect(
        supplyChain.connect(viewer).updateProduct(productId, "Shipped", "In Transit")
      ).to.be.reverted;
    });

    it("should fail to update non-existent product", async function () {
      await expect(
        supplyChain.connect(operator).updateProduct(999, "Shipped", "In Transit")
      ).to.be.revertedWith("Invalid product ID");
    });
  });

  describe("Product Viewing", function () {
    beforeEach(async function () {
      // Setup roles
      await supplyChain.assignRole(operator.address, "OPERATOR");
      await supplyChain.assignRole(viewer.address, "VIEWER");
      
      // Add a product
      await supplyChain.connect(operator).addProduct("Test Product", "Warehouse A", "In Stock");
    });

    it("should allow viewer to view products", async function () {
      const product = await supplyChain.connect(viewer).getProduct(1);
      expect(product.name).to.equal("Test Product", "Viewer should be able to see product");
    });

    it("should allow operator to view products", async function () {
      const product = await supplyChain.connect(operator).getProduct(1);
      expect(product.name).to.equal("Test Product", "Operator should be able to see product");
    });

    it("should allow manager to view products", async function () {
      const product = await supplyChain.getProduct(1); // owner is a manager
      expect(product.name).to.equal("Test Product", "Manager should be able to see product");
    });

    it("should fail if non-authorized user tries to view products", async function () {
      await expect(
        supplyChain.connect(noRole).getProduct(1)
      ).to.be.revertedWith("Access denied");
    });

    it("should fail when viewing non-existent product", async function () {
      await expect(
        supplyChain.connect(viewer).getProduct(999)
      ).to.be.revertedWith("Invalid product ID");
    });
  });

  describe("Multiple Products", function () {
    beforeEach(async function () {
      // Setup roles
      await supplyChain.assignRole(operator.address, "OPERATOR");
      
      // Add multiple products
      await supplyChain.connect(operator).addProduct("Product 1", "Warehouse A", "In Stock");
      await supplyChain.connect(operator).addProduct("Product 2", "Warehouse B", "Processing");
      await supplyChain.connect(operator).addProduct("Product 3", "Warehouse C", "Shipped");
    });

    it("should correctly track product counter", async function () {
      const counter = await supplyChain.productCounter();
      expect(counter).to.equal(3, "Product counter should be 3");
    });

    it("should retrieve distinct products", async function () {
      const product1 = await supplyChain.products(1);
      const product2 = await supplyChain.products(2);
      const product3 = await supplyChain.products(3);

      expect(product1.name).to.equal("Product 1", "Product 1 name incorrect");
      expect(product2.name).to.equal("Product 2", "Product 2 name incorrect");
      expect(product3.name).to.equal("Product 3", "Product 3 name incorrect");
      
      expect(product1.location).to.equal("Warehouse A", "Product 1 location incorrect");
      expect(product2.location).to.equal("Warehouse B", "Product 2 location incorrect");
      expect(product3.location).to.equal("Warehouse C", "Product 3 location incorrect");
    });
  });
});