const { execSync } = require('child_process');

const getS3BucketCredentials = (keyPairName, instanceId) => {
  const s3BucketRegion =  JSON.parse(execSync(`aws ec2 describe-instances --instance-ids ${instanceId} --query "Reservations[0].Instances[0].Placement.AvailabilityZone"`).toString()).slice(0,-1);
  const accessKeyId = execSync('aws configure get aws_access_key_id').toString().trim();
  const secretAccessKey = execSync('aws configure get aws_secret_access_key').toString().trim();

  return {
    "method": "S3 Staging",
    "s3_bucket_name":  `${keyPairName}-bucket`,
    "s3_bucket_region": s3BucketRegion,
    "access_key_id": accessKeyId,
    "secret_access_key" :  secretAccessKey
  }
}

module.exports = {
  getS3BucketCredentials
}