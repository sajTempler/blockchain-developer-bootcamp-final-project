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
  /// @param ownerAddress Address of token's new owner
  event AccountTokenized(uint256 indexed accountToken, address indexed ownerAddress);

  /// @notice Emitted when an account is added for offers listing
  /// @param price Price for new listing
  /// @param seller Address of a seller
  event AccountPutForSale(uint256 indexed price, address indexed seller);

  /// @notice Mapping from owner address to token (Account Token)
  mapping(address => uint256) private _tokenHolders;

  /// @notice This mapping holds available accounts for sale
  mapping(uint256 => AccountOffer) private _offers;

  /// @notice Keeps track of offers
  uint256[] private _tokensForSale;

  struct AccountOffer {
    uint256 price;
    address seller;
    bool sold;
  }

  modifier onlyTokenHolder() {
      require(_tokenHolders[msg.sender] != 0, "Caller does not hold any tokens");
      _;
  }

  modifier onlyNewAccounts() {
    require(_tokenHolders[msg.sender] == 0, "Caller already hold a token");
    _;
  }

  constructor() ERC721("TokenizedAccount", "TDA") {
  }

  function tokensForSale() public view returns (uint256[] memory) {
    return _tokensForSale;
  }

  function offer(uint256 tokenId) public view returns (AccountOffer memory) {
    return _offers[tokenId];
  }

  /// @notice Mints new Non-Fungible token for given address
  /// @param ownerAddress user address for whom the token will be mined
  /// @param platformAccountId some off-chain accout id
  /// @param tokenURI link to the platform that platformAccountId is associated with
  function tokenize(address ownerAddress, string memory platformAccountId, string memory tokenURI)
      public
      onlyNewAccounts
  {
      _tokenIds.increment();
      uint256 newItemId = _randomizeToken(ownerAddress, platformAccountId, _tokenIds.current());
      _safeMint(ownerAddress, newItemId);
      _setTokenURI(newItemId, tokenURI);
      _addTokenHolder(ownerAddress, newItemId);
      setApprovalForAll(address(this), true);
      emit AccountTokenized(newItemId, ownerAddress);
  }

  /// @notice Returns a token for given token holder, only owner can lookup his tokens
  /// @param holder holder address for whom the token was assigned
  function retrieveMyToken(address holder) public view returns (uint256) {
    require(holder == msg.sender, "Only owner can check his tokens");
    return _tokenHolders[holder];
  }

  function addAccountForSale(uint256 price, uint256 tokenId) public onlyTokenHolder {
    require(ownerOf(tokenId) == msg.sender, "caller must own given token");
    require(isApprovedForAll(msg.sender, address(this)), "contract must be approved");

    // todo verify that who receives money is still owner of the token


    _offers[tokenId] = AccountOffer(price, msg.sender, false);
    _tokensForSale.push(tokenId);
    emit AccountPutForSale(price, msg.sender);
  }

  function buyAccount(uint256 tokenId) public payable onlyNewAccounts {
    AccountOffer memory item = _offers[tokenId];
    require(msg.value >= item.price, "insufficient funds sent");
    require(_offers[tokenId].sold == false, "token is not for sale");

    // todo verify
    // setApprovalForAll(msg.sender, true);
    safeTransferFrom(item.seller, msg.sender, tokenId);
    payable(item.seller).transfer(msg.value);

    // update owner
    delete _tokenHolders[item.seller];
    item.sold = true;
    // offers[tokenId] = item;
    _tokenHolders[msg.sender] = tokenId;
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
