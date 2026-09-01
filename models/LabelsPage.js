export default class LabelsPage{

     constructor(page) {
    this.page = page

    this.menuLabels =  page.getByRole('menuitem', { name: 'Labels' })
    this.buttonCreate = page.getByRole('link', { name: 'Create' })
    this.inputName = page.getByRole('textbox', { name: 'Name' })
    this.buttonSave = page.getByRole('button', { name: 'Save' })

    this.alert = page.getByRole('alert');

    this.buttonDel = page.getByRole('button', { name: 'Delete' })
    this.buttonShow = page.getByRole('link', { name: 'Show' })
    this.buttonEdit = page.getByRole('link', { name: 'Edit' })

    this.tableLabels = page.getByRole('table')

    this.label ={
        name:'minor'
    }

  this.labelsArr = [
    {
        id:'1',
        name:'bug'
    },
    {
        id:'2',
        name:'feature'
    },
    {
        id:'3',
        name:'enhancement'
    },
    {
        id:'4',
        name:'task'
    },
     {
        id:'5',
        name:'critical'
    }
  ]


}

async createLabel(name ){
    await this.inputName.fill(name)
  }

}