const OptionCard = ({ owner, walletAccount }) => {
  return <option value={walletAccount}>{owner}</option>;
};

export default OptionCard;
