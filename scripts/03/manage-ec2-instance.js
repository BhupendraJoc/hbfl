// Imports
const AWS = require('aws-sdk')
AWS.config.update({region:'us-east-2'})
// TODO: Import the aws-sdk

// TODO: Configure region

// Declare local variables
// TODO: Create an ec2 object
const ec2 = new AWS.EC2()
function listInstances () {
  // TODO: List instances using ec2.describeInstances()
  return new Promise((resolve,reject)=>{
    ec2.describeInstances({},(err,data)=>{
      if(err)reject(err)
      else {resolve(data.Reservations.reduce((i,r)=>{
        return i.concat(r.Instances)
      },[]))
    }
    })
  })
}

function terminateInstance (instanceId) {
  const params={
    InstanceIds:[
      instanceId
    ]
  }
  return new Promise((resolve,reject)=>{
    ec2.terminateInstances(params,(err,data)=>{
      if(err)reject(err)
      else resolve(data)
    })
  })
  // TODO: Terminate an instance with a given instanceId
}

listInstances()
.then(data => console.log(data))
// terminateInstance('i-05417b7e0ceb64383')
// .then(data => console.log(data))
