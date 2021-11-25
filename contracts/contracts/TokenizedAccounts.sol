// SPDX-License-Identifier: MIT
pragma solidity >=0.8.9 <0.9.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract TokenizedAccounts is ERC721URIStorage {
  using Counters for Counters.Counter;
  Counters.Counter private _tokenIds;

  /// @notice Emitted when a new token is minted
  /// @param token The token associated with a user account
  /// @param ownerAddress Address of token's new owner
  event AccountTokenized(uint256 indexed token, address indexed ownerAddress);

  /// @notice Emitted when a token is put for sale listing
  /// @param price Price of a listing token
  /// @param seller Address of a seller
  /// @param buyer Approved address of a buyer
  event AccountPutForSale(uint256 indexed price, address indexed seller, address indexed buyer);

  /// @notice Emitted when a token is sold/bought
  /// @param token The token associated with a user account
  /// @param buyer Approved address of a buyer
  event AccountBought(uint256 indexed token, address indexed buyer);

  /// @notice Emitted when a token owner removes a token from selling list
  /// @param token The token associated with a user account
  event AccountForSaleRemoved(uint256 indexed token);

  /// @notice Mapping from owner address to a token (Account Token)
  mapping(address => uint256) private _tokenHolders;

  /// @notice Holds available offerings for sale for given address
  mapping(address => AccountOffer) private _offers;

  /// @notice Holds offerss put for sale by given address
  mapping(address => AccountOffer) private _offersForSale;

  struct AccountOffer {
    uint256 tokenId;
    uint256 price;
    address seller;
  }

  /**
    * @dev Throws if called by account that does not hold any tokens.
    */
  modifier onlyTokenHolder() {
      require(_tokenHolders[msg.sender] != 0, "Caller does not hold any tokens");
      _;
  }

  /**
    * @dev Throws if called by account that already does hold a token.
    */
  modifier onlyNewAccounts() {
    require(_tokenHolders[msg.sender] == 0, "Caller already hold a token");
    _;
  }

  /**
    * @dev Initializes the contract.
    */
  constructor() ERC721("TokenizedAccount", "TDA") {
  }

  /// @notice Returns offers avilable to buy by sender
  /// @return AccountOffer struct
  function myOffers() public view returns (AccountOffer memory) {
    require(_offers[msg.sender].seller != address(0), "no offers");
    return _offers[msg.sender];
  }

  /// @notice Returns offers that are put for sale by sender
  /// @return AccountOffer struct
  function myOffersForSale() public view returns (AccountOffer memory) {
    require(_offersForSale[msg.sender].seller != address(0), "no offers for sale");
    return _offersForSale[msg.sender];
  }

  /// @notice Mints new Non-Fungible token for given address
  /// @param ownerAddress user address for whom the token will be mined
  /// @param platformAccountId some off-chain accout id
  /// @param tokenURI link to the platform that platformAccountId is associated with
  function tokenize(address ownerAddress, string memory platformAccountId, string memory tokenURI)
      public
      onlyNewAccounts returns(uint256) {
      _tokenIds.increment();
      uint256 newItemId = _randomizeToken(ownerAddress, platformAccountId, _tokenIds.current());
      _safeMint(ownerAddress, newItemId);
      _setTokenURI(newItemId, tokenURI);
      _addTokenHolder(ownerAddress, newItemId);
      setApprovalForAll(address(this), true);
      emit AccountTokenized(newItemId, ownerAddress);
      return newItemId;
  }

  /// @notice Returns a token for given token holder, only owner can lookup his tokens
  /// @param holder holder address for whom the token was assigned
  /// @return uint256 token
  function retrieveMyToken(address holder) public view returns (uint256) {
    require(holder == msg.sender, "Only owner can check his tokens");
    return _tokenHolders[holder];
  }

  /// @notice Put given token for a sale for given price for given address
  /// @param price price for given token
  /// @param tokenId given token for sale
  /// @param buyer address of a buyer that will be approve
  function addAccountForSale(uint256 price, uint256 tokenId, address buyer) public onlyTokenHolder {
    require(ownerOf(tokenId) == msg.sender, "caller must own given token");
    require(isApprovedForAll(msg.sender, address(this)), "contract must be approved");

    AccountOffer memory offer = AccountOffer(tokenId, price, msg.sender);
    approve(buyer, tokenId);
    _offers[buyer] = offer;
    _offersForSale[msg.sender] = offer;
    emit AccountPutForSale(price, msg.sender, buyer);
  }

  /// @notice Put given token for a sale for given price for given address
  /// @param tokenId given token to be removed from sale listing
  /// @param buyer address of a buyer
  function removeAccountForSale(uint256 tokenId, address buyer) public onlyTokenHolder {
    require(ownerOf(tokenId) == msg.sender, "caller must own given token");
    delete _offersForSale[buyer];
    emit AccountForSaleRemoved(tokenId);
  }

  /// @notice Transfers a token to a buyer address for given price
  /// @param tokenId given token to be bought
  function buyAccount(uint256 tokenId) public payable onlyNewAccounts {
    AccountOffer memory item = _offers[msg.sender];
    require(msg.value >= item.price, "insufficient funds sent");

    safeTransferFrom(item.seller, msg.sender, tokenId);
    payable(item.seller).transfer(msg.value);

    // update owner
    delete _tokenHolders[item.seller];
    delete _offers[msg.sender];
    delete _offersForSale[item.seller];
    _tokenHolders[msg.sender] = tokenId;
    setApprovalForAll(address(this), true);
    emit AccountBought(tokenId, msg.sender);
  }

  /// @notice not implemented yet
  /// Allow seller to specify other (than seller) address to withdraw funds
  function withdraw() public pure {
    // todo
    require(false, "not implemented yet");
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
  /// @param holder holder address for whom the token will be assigned
  /// @param token a unique token
  function _addTokenHolder(address holder, uint256 token) private {
    _tokenHolders[holder] = token;
  }
}
