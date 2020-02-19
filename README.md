![](https://raw.githubusercontent.com/cto-ai/aws/master/assets/banner.png)

# AWS - Interactive CLI

An interactive command line wrapper of the AWS CLI.

![](https://raw.githubusercontent.com/cto-ai/aws/master/assets/screenshot_cli.png)

## Requirements

To run this or any other Op, install the [Ops Platform](https://cto.ai/platform).

Find information about how to run and build Ops via the [Ops Platform Documentation](https://cto.ai/docs/overview).

This Op also requires AWS credentials to work with your account. Here's what you'll need before running this Op the first time:

- **AWS Access Key Id**: via the [AWS Management Console](https://console.aws.amazon.com/):
  - `AWS Management Console` -> `Security Credentials` -> `Access Keys`
- **AWS Access Key Secret**: via the [AWS Management Console](https://console.aws.amazon.com/):
  - `AWS Management Console` -> `Security Credentials` -> `Access Keys`

## Usage

To initiate the interactive AWS CLI prompt run:

```bash
ops run aws
```

## Available Commands

To skip the service selection prompt you can run:

```bash
ops run aws [service option]
```

For example, to use the ec2 service you can run:

```bash
ops run aws ec2
```

For power users, the Op offers the option to entirely skip interactive prompts, by running:

```text
ops run aws [full command] [-p || --powermode]
```

## Local Development / Running from Source

**1. Clone the repo:**

```bash
git clone <git url>
```

**2. Navigate into the directory and install dependencies:**

```bash
cd aws && npm install
```

**1. Run the Op from your current working directory with:**

```bash
ops run .
```

## Debugging Issues

Use the `DEBUG` flag in the terminal to see verbose Op output like so:

```bash
DEBUG=aws:* ops run aws
```

When submitting issues or requesting help, be sure to also include the version information. To get your ops version run:

```bash
ops -v
```

## Resources

### AWS Docs

- [Getting Started on Amazon Web Services (AWS)](https://aws.amazon.com/getting-started/)
- [AWS CLI Command Reference](https://docs.aws.amazon.com/cli/latest/reference/)
