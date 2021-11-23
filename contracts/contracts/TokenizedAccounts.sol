// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";


contract TokenizedAccounts is Ownable, ERC721URIStorage {
  using Counters for Counters.Counter;
  Counters.Counter private _tokenIds;

  /// @notice Emitted when a new account is minted
  /// @param accountToken Account token
  event AccountTokenized(uint256 indexed accountToken, address indexed userAccount);

  /// @notice Mapping from owner address to token (Account Token)
  mapping(address => uint256) private _tokenHolders;

  /// @notice This mapping holds available accounts for sale
  mapping(uint256 => AccountOffer) public offers;

  struct AccountOffer {
    uint256 price;
    address seller;
  }

  constructor() ERC721("TokenizedAccount", "TDA") {
    setApprovalForAll(address(this), true);
  }

  /// @notice Mints new Non-Fungible token for given address, only administrator can do so
  /// @param userAccount user address for whom the token will be mined
  /// @param platformAccountId some off-chain accout id
  /// @param tokenURI link to the platform that platformAccountId is associated with
  function tokenize(address userAccount, string memory platformAccountId, string memory tokenURI)
      public
      onlyOwner
      returns (uint256)
  {
      _tokenIds.increment();

      uint256 newItemId = _randomizeToken(userAccount, platformAccountId, _tokenIds.current());
      _safeMint(userAccount, newItemId);
      _setTokenURI(newItemId, tokenURI);
      _addTokenForOwner(userAccount, newItemId);
      emit AccountTokenized(newItemId, userAccount);
      return newItemId;
  }

  /// @notice Makes the token look more random than simple counter
  /// @param userAccount user address for whom the token will be mined
  /// @param accountId some off-chain accout id
  /// @param uniqueNumber a unique counter to make token unique
  function _randomizeToken(
    address userAccount,
    string memory accountId,
    uint256 uniqueNumber
  ) private pure returns (uint256) {
    return uint256(
      keccak256(
        abi.encode(
          userAccount,
          accountId,
          uniqueNumber
        )
      )
    );
  }

  /// @notice Add token to owner -> token mapping
  /// @param owner owner address for whom the token will be assigned
  /// @param token a unique token
  function _addTokenForOwner(address owner, uint256 token) private {
    // todo handle case when owner already have an account 
    _tokenHolders[owner] = token;
  }

  /// @notice Returns a token for given user, only owner can lookup his tokens
  /// @param owner owner address for whom the token will be assigned
  function retrieveMyAccountTokens(address owner) public view returns (uint256) {
    require(owner == msg.sender, "Only owner can check his tokens");
    return _tokenHolders[owner];
  }

  function addAccountForSale(uint256 price, uint256 tokenId) public {
    require(ownerOf(tokenId) == msg.sender, "caller must own given token");
    require(isApprovedForAll(msg.sender, address(this)), "contract must be approved");

    // todo verify that who receives money is still owner of the token


    offers[tokenId] = AccountOffer(price, msg.sender);
  }

  function buyAccount(uint256 tokenId) public payable {
    AccountOffer memory item = offers[tokenId];
    require(msg.value >= item.price, "insufficient funds sent");
    
    safeTransferFrom(item.seller, msg.sender, tokenId);
    payable(item.seller).transfer(msg.value);

    // update owner
    delete _tokenHolders[item.seller];
    _tokenHolders[msg.sender] = tokenId;
  }
}
