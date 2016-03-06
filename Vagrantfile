# -*- mode: ruby -*-
# vi: set ft=ruby :

Vagrant.configure(2) do |config|

  config.vm.box = "hashicorp/precise64"

  # Port forwardings:

  # Frontend dev server
  config.vm.network :forwarded_port, guest: 1337, host: 1337

  config.vm.provider :virtualbox do |vb|
    vb.customize ["modifyvm", :id, "--memory", "2048"]
  end

  config.vm.provision "shell", path: "bootstrap.sh", privileged: false

end
