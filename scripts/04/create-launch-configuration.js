const { EC2 } = require('aws-sdk')
const AWS = require('aws-sdk')
const helpers = require('./helpers')

AWS.config.update({ region: 'us-east-2' })

// Declare local variables
// TODO: Create an autoscaling object
const autoScaling = new AWS.AutoScaling()
const lcName = 'hamsterLC'
const roleName = 'hamsterLCRole'
const sgName = 'hamster_sg'
const keyName = 'hamster_key'

helpers.createIamRole(roleName)
.then(profileArn => createLaunchConfiguration(lcName, profileArn))
.then(data => console.log(data))

function createLaunchConfiguration (lcName, profileArn) {
  // TODO: Create a launch configuration
  const params = {
    IamInstanceProfile:profileArn,
    ImageId:'ami-0256d9a464de99756',
    InstanceType:'t2.micro',
    LaunchConfigurationName:lcName,
    KeyName:keyName,
    SecurityGroups:[
      sgName
    ],
    UserData:'IyEvYmluL2Jhc2gKc3VkbyBhcHQtZ2V0IHVwZGF0ZQpzdWRvIGFwdC1nZXQgLXkgaW5zdGFsbCBnaXQKZ2l0IGNsb25lIGh0dHBzOi8vZ2l0aHViLmNvbS9yeWFubXVyYWthbWkvaGJmbC5naXQgL2hvbWUvYml0bmFtaS9oYmZsCmNob3duIC1SIGJpdG5hbWk6IC9ob21lL2JpdG5hbWkvaGJmbApjZCAvaG9tZS9iaXRuYW1pL2hiZmwKc3VkbyBucG0gaQpzdWRvIG5wbSBydW4gc3RhcnQ='
  }

  return new Promise((resolve,reject)=>{
    autoScaling.createLaunchConfiguration(params,(err,data)=>{
      if(err) reject(err)
      else resolve(data)
    })
  })
}
