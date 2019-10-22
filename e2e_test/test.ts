import 'mocha'
import chai, { expect } from 'chai'
import chaiAsPromise from 'chai-as-promised'
import { execute } from './test_helper'
import cmdObject from './test_constants'

chai.use(chaiAsPromise)

const { ec2AuthorizeSecurityGroupIngressErrorFlow, s3lsSuccessFlow } = cmdObject

const getSubset = (start, end, arr) => {
  return arr.slice(start, end).reduce((acc, curr) => acc.concat(curr), [])
}

describe('E2E testing', () => {
  it('should successfully return stdout "information details" from AWS info', done => {
    expect(
      execute(
        'src/index.ts',
        [],
        getSubset(0, 1, ec2AuthorizeSecurityGroupIngressErrorFlow)
      )
    )
      .to.eventually.have.string(
        'Please select the information details you wish to review'
      )
      .notify(done)
  })

  it('should successfully return stdout "aws commands" from AWS available commands', done => {
    expect(
      execute(
        'src/index.ts',
        [],
        getSubset(0, 2, ec2AuthorizeSecurityGroupIngressErrorFlow)
      )
    )
      .to.eventually.have.string('Select the following aws command')
      .notify(done)
  })

  it('should successfully return stdout "information details" from AWS ec2 command', done => {
    expect(
      execute(
        'src/index.ts',
        [],
        getSubset(0, 3, ec2AuthorizeSecurityGroupIngressErrorFlow)
      )
    )
      .to.eventually.have.string(
        'Please select the information details you wish to review'
      )
      .notify(done)
  })

  it('should successfully return stdout "accept-reserved-instances-exchange-quote" from ec2 available commands', done => {
    expect(
      execute(
        'src/index.ts',
        [],
        getSubset(0, 4, ec2AuthorizeSecurityGroupIngressErrorFlow)
      )
    )
      .to.eventually.have.string('accept-reserved-instances-exchange-quote')
      .notify(done)
  })

  it('should successfully return stdout "information details" from AWS ec2 authorize-security-group-ingress', done => {
    expect(
      execute(
        'src/index.ts',
        [],
        getSubset(0, 5, ec2AuthorizeSecurityGroupIngressErrorFlow)
      )
    )
      .to.eventually.have.string(
        'Please select the information details you wish to review'
      )
      .notify(done)
  })

  it('should successfully return stdout "arguments list" from AWS ec2 authorize-security-group-ingress', done => {
    expect(
      execute(
        'src/index.ts',
        [],
        getSubset(0, 6, ec2AuthorizeSecurityGroupIngressErrorFlow)
      )
    )
      .to.eventually.have.string('This command has these arguments.')
      .notify(done)
  })

  it('should successfully return stdout "prompt confirmation"', done => {
    expect(
      execute(
        'src/index.ts',
        [],
        getSubset(0, 7, ec2AuthorizeSecurityGroupIngressErrorFlow)
      )
    )
      .to.eventually.have.string(
        "Please type in 'yes' to confirm and execute command!"
      )
      .notify(done)
  })

  it('should successfully return stdout "error: groupname or groupid"', done => {
    expect(
      execute(
        'src/index.ts',
        [],
        getSubset(0, 8, ec2AuthorizeSecurityGroupIngressErrorFlow)
      )
    )
      .to.eventually.have.string('groupname or groupid')
      .notify(done)
  })

  // it('should successfully run command', (done) => {
  //   expect(execute('src/index.ts'), [], s3lsSuccessFlow))
  //   .to.eventually.have.string('').notify(done)
  // })
})
