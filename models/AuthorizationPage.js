export default class AuthorizationPage{
    
    constructor(page) {
    this.page = page

    this.inputUsername = page.getByLabel('Username')
    this.inputPassword = page.getByLabel('Password')
    this.buttonSign = page.getByRole('button',{name:'Sign in'})
    this.profile = page.getByLabel('Profile')
    this.logout = page.getByRole('menuitem', { name: 'Logout' });
    }

    async goto() {
    await this.page.goto('/#/login')
  }

    async login(username,password){
      await this.inputUsername.fill(username)
      await this.inputPassword.fill(password)
    }

    async signIn(username,password){
      await this.login(username,password)
      await this.buttonSign.click();
    }
}