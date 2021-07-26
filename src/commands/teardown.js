const { execSync, exec } = require("child_process");

const teardown = () => {
  // get stack names
  const airbyteStackName = JSON.parse(execSync('aws ssm get-parameter --name "/airbyte/stack-name"').toString()).Parameter.Value;
  const grouparooStackName = JSON.parse(execSync('aws ssm get-parameter --name "/grouparoo/stack-name"').toString()).Parameter.Value;

  // delete stacks
  console.log('Deleting Airbyte stack...');
  execSync(`aws cloudformation delete-stack --stack-name ${airbyteStackName}`);
  execSync(`aws cloudformation wait stack-delete-complete --stack-name ${airbyteStackName}`);

  console.log('Deleting Grouparoo stack...');
  execSync(`aws cloudformation delete-stack --stack-name ${grouparooStackName}`);
  execSync(`aws cloudformation wait stack-delete-complete --stack-name ${grouparooStackName}`);

  // get s3 bucket name (get from params store?)
  // const airbyteS3bucketName = execSync('COMMAND HERE'); // TODO

  // empty s3 bucket
  // console.log('Emptying S3 buckets...');
  // execSync(`aws s3 rm s3://${airbyteS3bucketName} --recursive`);
  // TODO - wait for bucket to empty

  // delete s3 bucket
  // console.log('Deleting S3 buckets...');
  // execSync(`aws s3api delete-bucket --bucket ${airbyteS3bucketName}`);
  // execSync(`aws s3api wait bucket-not-exists --bucket ${airbyteS3bucketName}`);
  // console.log('Airbyte S3 bucket deleted!');

  // remove ECR repo
  console.log('Removing Grouparoo repository from ECR...');
  execSync('aws ecr delete-repository --repository-name grouparoo');

  // removing key-pairs
  console.log('Removing Tapestry key-pairs...');
  const keyPairName = JSON.parse(execSync('aws ssm get-parameter --name "/tapestry/key-pair-name"').toString()).Parameter.Value;
  execSync(`aws ec2 delete-key-pair --key-name ${keyPairName}`);
}

module.exports = () => {
  console.log('Teardown process initiated...');
  teardown();
  console.log('Teardown complete!');
}