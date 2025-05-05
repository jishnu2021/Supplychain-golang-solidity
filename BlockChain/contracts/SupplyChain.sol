// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/AccessControl.sol";

contract SupplyChain is AccessControl {
    bytes32 public constant MANAGER_ROLE = keccak256("MANAGER_ROLE");
    bytes32 public constant OPERATOR_ROLE = keccak256("OPERATOR_ROLE");
    bytes32 public constant VIEWER_ROLE = keccak256("VIEWER_ROLE");

    uint256 public productCounter;

    struct Product {
        uint256 id;
        string name;
        string location;
        string status;
        address addedBy;
    }

    mapping(uint256 => Product) public products;

    event ProductAdded(uint256 id, string name, address addedBy);
    event ProductUpdated(uint256 id, string status, string location);
constructor() {
    _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
    _grantRole(MANAGER_ROLE, msg.sender); // Owner is also a manager
}

    // ✅ Only Manager can assign roles
    function assignRole(address user, string memory role) public onlyRole(MANAGER_ROLE) {
        bytes32 roleHash = keccak256(abi.encodePacked(role));
        if (roleHash == keccak256("OPERATOR")) {
            grantRole(OPERATOR_ROLE, user);
        } else if (roleHash == keccak256("VIEWER")) {
            grantRole(VIEWER_ROLE, user);
        } else if (roleHash == keccak256("MANAGER")) {
            grantRole(MANAGER_ROLE, user);
        } else {
            revert("Invalid role");
        }
    }

    // ✅ Operator & Manager can add products
    function addProduct(string memory name, string memory location, string memory status) public onlyRole(OPERATOR_ROLE) {
        productCounter++;
        products[productCounter] = Product(productCounter, name, location, status, msg.sender);
        emit ProductAdded(productCounter, name, msg.sender);
    }

    // ✅ Operator & Manager can update product
    function updateProduct(uint256 id, string memory newStatus, string memory newLocation) public onlyRole(OPERATOR_ROLE) {
        require(id > 0 && id <= productCounter, "Invalid product ID");
        Product storage product = products[id];
        product.status = newStatus;
        product.location = newLocation;
        emit ProductUpdated(id, newStatus, newLocation);
    }

    // ✅ Viewer, Operator & Manager can view product
    function getProduct(uint256 id) public view returns (Product memory) {
        require(
            hasRole(VIEWER_ROLE, msg.sender) ||
            hasRole(OPERATOR_ROLE, msg.sender) ||
            hasRole(MANAGER_ROLE, msg.sender),
            "Access denied"
        );
        require(id > 0 && id <= productCounter, "Invalid product ID");
        return products[id];
    }

    // ✅ Check role utility
    function checkMyRole() public view returns (string memory) {
        if (hasRole(MANAGER_ROLE, msg.sender)) return "MANAGER";
        if (hasRole(OPERATOR_ROLE, msg.sender)) return "OPERATOR";
        if (hasRole(VIEWER_ROLE, msg.sender)) return "VIEWER";
        return "NO ROLE";
    }
}
