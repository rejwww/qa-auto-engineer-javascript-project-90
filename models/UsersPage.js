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

  this.usersArr = [
    {
      id: '1',
      email:'john@google.com',
      firstName:'John',
      lastName:'Doe',
      createdAt:'30.10.2023, 04:00:00'
    },
     {
      id: '2',
      email:'jack@yahoo.com',
      firstName:'Jack',
      lastName:'Jons',
      createdAt:'30.10.2023, 04:00:00'
    },
    {
      id: '3',
      email:'jane@gmail.com',
      firstName:'Jane',
      lastName:'Smith',
      createdAt:'05.11.2023, 04:00:00'
    },
     {
      id: '4',
      email:'alice@hotmail.com',
      firstName:'Alice',
      lastName:'Johnson',
      createdAt:'06.11.2023, 04:00:00'
    },
    {
      id: '5',
      email:'peter@outlook.com',
      firstName:'Peter',
      lastName:'Brown',
      createdAt:'07.11.2023, 04:00:00'
    },
     {
      id: '6',
      email:'sarah@example.com',
      firstName:'Sarah',
      lastName:'Wilson',
      createdAt:'08.11.2023, 04:00:00'
    },
    {
      id: '7',
      email:'michael@example.com',
      firstName:'Michael',
      lastName:'Davis',
      createdAt:'09.11.2023, 04:00:00'
    },
     {
      id: '8',
      email:'emily@example.com',
      firstName:'Emily',
      lastName:'Martinez',
      createdAt:'10.11.2023, 04:00:00'
    }
  ]


 
}

   async createUser(email , firstName , lastName){
    await this.inputEmail.fill(email)
    await this.inputFirstName.fill(firstName)
    await this.inputLastName.fill(lastName)
  }
}