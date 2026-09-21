export default class UsersPage{

     constructor(page) {
    this.page = page

   this.menuUsers =  page.getByRole('menuitem', { name: 'Users' })
   this.buttonCreate = page.getByRole('link', { name: 'Create' })
   this.inputEmail = page.getByRole('textbox', { name: 'Email' })
   this.inputFirstName = page.getByRole('textbox', { name: 'First name' })
   this.inputLastName = page.getByRole('textbox', { name: 'Last name' })
   this.buttonSave = page.getByRole('button', { name: 'Save' })

   this.alert = page.getByRole('alert');
   
   this.buttonDel = page.getByRole('button', { name: 'Delete' })
   this.buttonShow = page.getByRole('link', { name: 'Show' })
   this.buttonEdit = page.getByRole('link', { name: 'Edit' })

   this.tableUsers = page.getByRole('table')

   this.user ={
    email:'cin@ya.ru',
    firstName:'Cin',
    lastName:'Zin'
  }

 
}

  async createUser(email , firstName , lastName){
    await this.inputEmail.fill(email)
    await this.inputFirstName.fill(firstName)
    await this.inputLastName.fill(lastName)
  }

  async completeСreationUser(email , firstName , lastName){
    await this.menuUsers.click()
    await this.buttonCreate.click()
    await this.createUser(email , firstName , lastName)
    await this.buttonSave.click()
}

async openRow(name){
  await this.menuUsers.click()
  const tr = this.page.getByRole('row')
                 .filter({ hasText: name })
  await tr.click()

}

async selectRow(name){
  const checkboxUser = this.page.getByRole('row')
                 .filter({ hasText: name})
                 .getByRole('checkbox')
  await checkboxUser.click()
}
}