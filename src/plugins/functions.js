export async function login(username, password, self, turnBack = true) {
  if (username === undefined || password === undefined) {
    if (turnBack) {
      self.$router.push({
        name: "Login"
      });
    }
    return false;
  }
  let returned;
  await self.$store.getters.database
    .collection('account')
    .where('user', '==', username)
    .where('pass', '==', password)
    .get()
    .then((snapshot) => {
      returned = snapshot.docs.length > 0;
      if (turnBack && !returned) {
        self.$router.push({
          name: "Login"
        });
      }
    });
  return returned;
}

export async function isAdmin(username, password, self) {
  let returned = false;
  await self.$store.getters.database
    .collection('account')
    .where('user', '==', username)
    .where('pass', '==', password)
    .get()
    .then((snapshot) => {
      if (snapshot.docs.length == 1)
        if (snapshot.docs[0].data().admin)
          returned = true;
    });
  return returned;
}

export async function getViewPermissions(username, password, self) {
  let returned = false;
  await self.$store.getters.database
    .collection('account')
    .where('user', '==', username)
    .where('pass', '==', password)
    .get()
    .then((snapshot) => {
      if (snapshot.docs.length == 1)
        if (snapshot.docs[0].data().viewPermission)
          returned = true;
    });
  return returned;
}