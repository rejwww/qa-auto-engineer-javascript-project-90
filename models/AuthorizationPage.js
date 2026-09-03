export default class AuthorizationPage{
    
    constructor(page) {
    this.page = page

    this.inputUsername = page.getByLabel('Username')
    this.inputPassword = page.getByLabel('Password')
    this.buttonSign = page.getByRole('button',{name:'Sign in'})
    }

    async goto() {
    await this.page.goto('/#/login')
  }

    async login(username,password){
      await this.inputUsername.fill(username)
      await this.inputPassword.fill(password)
    }
}