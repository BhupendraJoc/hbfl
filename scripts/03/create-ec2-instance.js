// Imports
// TODO: Import the ec2 client
const AWS = require('aws-sdk')
const { resolve, reject } = require('bluebird')
const helpers = require('./helpers')

AWS.config.update({region:"us-east-2"})
const ec2= new AWS.EC2()
function sendCommand (command) {
  // TODO: Create new client with region
  // TODO: Return send command
}

// Declare local variables
const sgName = 'hamster_sg2'
const keyName = 'hamster_key2'


// Do all the things together
async function execute () {
  try {
    await createSecurityGroup(sgName)
    const keyPair = await createKeyPair(keyName)
    await helpers.persistKeyPair(keyPair)
    const data = await createInstance(sgName, keyName)
    console.log('Created instance with:', data)
  } catch (err) {
    console.error('Failed to create instance with:', err)
  }
}
execute();
// Create functions
async function createSecurityGroup (sgName) {
  // TODO: Implement sg creation & setting SSH rule
  const params={
    Description:sgName,
    GroupName: sgName
  }

  return new Promise((resolve,reject)=>{
    ec2.createSecurityGroup(params,(err,data)=>{
      if(err) reject(err)
      else{
        const params = {
          GroupId:data.GroupId,
          IpPermissions:[
            {
              IpProtocol:'tcp',
              FromPort:22,
              ToPort:22,
              IpRanges:[
                {
                  CidrIp:'0.0.0.0/0'
                }
              ]
            },
            {
              IpProtocol:'tcp',
              FromPort:3000,
              ToPort:3000,
              IpRanges:[
                {
                  CidrIp:'0.0.0.0/0'
                }
              ]
            }
          ]
        }
        ec2.authorizeSecurityGroupIngress(params,(err)=>{
          if(err)reject(err)
          else resolve()
        })
      }
    })
  })
}

async function createKeyPair (keyName) {
  // TODO: Create keypair
  const params = {
    KeyName:keyName
  }

  return new Promise((resolve,reject)=>{
    ec2.createKeyPair(params,(err,data)=>{
      if(err)reject(err)
      else resolve(data)
    })
  })
}

async function createInstance (sgName, keyName) {
  // TODO: create ec2 instance
  const params={
    ImageId:'ami-043f3160d6e9b6dcd',
    InstanceType:'t2.micro',
    KeyName:keyName,
    MaxCount:1,
    MinCount:1,
    SecurityGroups:[
      sgName
    ],
    UserData:'IyEvYmluL2Jhc2gKc3VkbyBhcHQtZ2V0IHVwZGF0ZQpzdWRvIGFwdC1nZXQgLXkgaW5zdGFsbCBnaXQKZ2l0IGNsb25lIGh0dHBzOi8vZ2l0aHViLmNvbS9yeWFubXVyYWthbWkvaGJmbC5naXQgL2hvbWUvYml0bmFtaS9oYmZsCmNob3duIC1SIGJpdG5hbWk6IC9ob21lL2JpdG5hbWkvaGJmbApjZCAvaG9tZS9iaXRuYW1pL2hiZmwKc3VkbyBucG0gaQpzdWRvIG5wbSBydW4gc3RhcnQ='
  }
  return new Promise((resolve,reject)=>{
    ec2.runInstances(params,(err,data)=>{
      if(err)reject(err)
      else resolve(data)
    })
  })
}
