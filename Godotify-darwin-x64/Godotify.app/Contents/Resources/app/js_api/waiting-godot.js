

login({email: 'codejoust@gmail.com', password: 'iainnash'}, function(err, api) {
  if (err) return console.error(err);
  api.listen((err, message) => {
   api.sendMessage(message.body, message.threadID);
   console.log(message);
 });
});
