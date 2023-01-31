class Authenticator {
  static loggedIn() {
    return !!sessionStorage.jwt;
  }

  static logout() {
    sessionStorage.clear();
  }
}

export default Authenticator;
