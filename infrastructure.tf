# Adds environment variable for identifying deployment to
# production vs non-production environments
variable "environment" {
  type = "string"
}

# PROVIDERS expose resources and understand API interactions of various providers.
# Here, location of AWS credential file and region specification are exposed as resource so that
# terraform can connect to AWS user associated with credential file and use correct region for instances
provider "aws" {
  shared_credentials_file = "~/.aws/credentials"
  region                  = "us-east-1"
}

# RESOURCES are any components for infrastructure, are key value pairs of TYPE (1st) and NAME (2nd)
# This declares aws_security_group as TYPE of resource and "game_security_group" as NAME of resource and defines a security group in AWS
# Within the block, configuration variables are defined for the resource which are inbound and outbound traffic allowed for security group
resource "aws_security_group" "game_security_group" {
  name   = "GameSecurityGroup_${var.environment}"

  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 3000
    to_port     = 3000
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

# Resource for the instance which is named game_server containing configuration variables for new instance
# The configuration variables are then used to configure the new instance when created
resource "aws_instance" "game_server" {
  ami                    = "ami-0ac019f4fcb7cb7e6"
  instance_type          = "t2.micro"
  key_name               = "GameKeyPair"
  vpc_security_group_ids = ["${aws_security_group.game_security_group.id}"]
  tags {
    Name = "GameServer_${var.environment}"
  }
  
  # FILE PROVISIONER is used to copy file from local machine to new remote AWS instance created
  # Here, initialization script from local machine is copied to new instance created
  # Then once done, script will be present and can be executed within new instance created
  provisioner "file" {
    source      = "scripts/initialize_game_api_instance.sh"
    destination = "/home/ubuntu/initialize_game_api_instance.sh"

    connection {
      type        = "ssh"
      user        = "ubuntu"
      private_key = "${file("~/.aws/GameKeyPair.pem")}"
    }
  }

  # FILE PROVISIONER is used to copy file from local machine to new remote AWS instance created
  # Here, docker compose script from local machine is copied to new instance created
  # Then once done, script will be present and can be executed within new instance created
  provisioner "file" {
    source      = "scripts/docker_compose_up.sh"
    destination = "/home/ubuntu/docker_compose_up.sh"

    connection {
      type        = "ssh"
      user        = "ubuntu"
      private_key = "${file("~/.aws/GameKeyPair.pem")}"
    }
  }

  # Here, docker compose file from local machine is copied to new instance created
  # Then once done, can be used from within the new instance created
  provisioner "file" {
    source      = "docker-compose.yml"
    destination = "/home/ubuntu/docker-compose.yml"

    connection {
      type        = "ssh"
      user        = "ubuntu"
      private_key = "${file("~/.aws/GameKeyPair.pem")}"
    }
  }

  # This is used to run commands on the instance we just created.
  # Terraform does this by SSHing into the instance and then executing the commands.
  # Since it can take time for the SSH agent on machine to start up we let Terraform
  # handle the retry logic, it will try to connect to the agent until it is available
  # that way we know the instance is available through SSH after Terraform finishes.
  
  # Here, we make sure that the initialization script and compose script is executable within instance created,
  # e.g. that we have permission to run it
  provisioner "remote-exec" {
    inline = [
      "chmod +x /home/ubuntu/initialize_game_api_instance.sh",
      "chmod +x /home/ubuntu/docker_compose_up.sh",

    ]
    connection {
      type        = "ssh"
      user        = "ubuntu"
      private_key = "${file("~/.aws/GameKeyPair.pem")}"
    }
  }
}

# Custom ouput command for variable belonging to new instance created
# The value of the variable here is the newly created instance's public IP address
# s.t. the bash command terraform output public_ip outputs the public ip address for the new instance
output "public_ip" {
  value = "${aws_instance.game_server.public_ip}"
}