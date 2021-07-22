const randomizeKeyPairName = () => {
  const characters =  "abcdefghijklmnopqrstuvwxyz1234567890";
  const length = 5; 
  let randomString = ""; 
  for (let i=1; i <= length; i++) {
    let index = Math.floor(Math.random() * characters.length);
    randomString += characters[index];
  }

  return "tapestry-key-pair-" + randomString;
}

module.exports = {
  randomizeKeyPairName
}