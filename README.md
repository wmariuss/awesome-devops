# Awesome DevOps

[![Awesome](https://awesome.re/badge.svg)](https://awesome.re)

A curated list of awesome DevOps tools, platforms and resources.

- [Awesome DevOps](#awesome-devops)
  - [Cloud Platforms](#cloud-platforms)
  - [Open Source Cloud Platforms](#open-source-cloud-platforms)
  - [Operating Systems](#operating-systems)
  - [Distributed Filesystems](#distributed-filesystems)
  - [Applications Platforms](#applications-platforms)
  - [Container Image Registry](#container-image-registry)
  - [Automation & Orchestration](#automation-&-orchestration)
  - [Continuous Integration & Delivery](#continuous-integration-&-delivery)
  - [Source Code Management](#source-code-management)
  - [Web Servers](#web-servers)
  - [Databases](#databases)
  - [Observability and Monitoring](#observability-&-monitoring)
  - [Service Discovery & Service Mesh](#service-discovery-&-service-mesh)
  - [API Gateway](#api-gateway)
  - [Code review](#code-review)
  - [Distributed messaging](#distributed-messaging)
  - [Programming Languages](#programming-languages)
  - [Chat and ChatOps](#chat-and-chatops)
  - [Secret Management](#secret-management)
  - [Sharing](#sharing)
  - [Resources](#resources)
    - [Books](#books)
    - [Conferences](#conferences)
  - [Contributing](#contributing)
  - [Authors](#authors)

---

## Cloud Platforms

*Public and Private Cloud Platforms.*

- [Amazon Web Services (AWS)](https://aws.amazon.com/) - Cloud Computing Services.
- [Google Cloud Platform (GCP)](https://cloud.google.com/) - Cloud Computing Services.
- [Azure](https://azure.microsoft.com/) - Cloud Computing Platform & Services.
- [Alibaba Cloud](https://us.alibabacloud.com/) - integrated suite of cloud products and services.
- [Oracle Cloud](https://www.oracle.com/cloud/) - comprehensive and fully integrated stack of cloud applications and platform services.
- [DigitalOcean](https://www.digitalocean.com/) - helping developers easily build, test, manage, and scale applications of any size.
- [Scaleway](https://www.scaleway.com/) - single way to create, deploy and scale your infrastructure in the cloud.
- [Vultr](https://www.vultr.com/) - easily deploy cloud servers, bare metal, and storage worldwide.
- [VMware Cloud](https://cloud.vmware.com/) - run, manage, connect and protect all of your apps on any cloud.

## Open Source Cloud Platforms

*Private, Public and Hybrid open source Cloud Platforms.*

- [Openstack](https://www.openstack.org/) - open source software for creating private and public clouds.
- [Apache CloudStack](https://cloudstack.apache.org/) - designed to deploy and manage large networks of virtual machines.
- [OpenNebula](https://opennebula.org/) - build Private Clouds and manage Data Center virtualization based on KVM, LXD and VMware.
- [Eucalyptus](https://www.eucalyptus.cloud/) - building AWS-compatible private and hybrid clouds.
- [DC/OS](https://dcos.io/) - distributed operating system based on the Apache Mesos distributed systems kernel.
- [Apache Mesos](http://mesos.apache.org/) - program against your datacenter like it’s a single pool of resources.

## Operating Systems

*Operating Systems - Server Platform.*

- [Ubuntu](https://ubuntu.com/)
- [CentOS](https://www.centos.org/)
- [CoreOS](http://coreos.com/)
- [OSv](http://osv.io/) - versatile modular unikernel designed to run unmodified Linux applications securely on micro-VMs in the cloud.
- [Rancher OS](https://rancher.com/rancher-os) - a lightweight, secure Linux distribution, built from containers to run containers well.
- [Atomic](http://www.projectatomic.io/) - use immutable infrastructure to deploy and scale your containerized applications.

## Distributed Filesystems

*Network distributed filesystems.*

- [Chep](https://ceph.io/) - highly scalable object, block and file-based storage under one whole system.
- [Gluster](https://www.gluster.org/) - free and open source software scalable network filesystem.
- [LINBIT](https://www.linbit.com/en/) - create, remove, and replicate block storage devices for datacenter scale environments.
- [XtreemFS](http://www.xtreemfs.org/) - fault-tolerant distributed file system for all storage needs.

## Applications Platforms

*Applications management platforms, Containers management.*

- [Openshift](https://www.openshift.com/) - the Kubernetes platform for big ideas.
- [Dokku](http://dokku.viewdocs.io/dokku/) - helps you build and manage the lifecycle of applications.
- [Flynn](https://flynn.io/) - open source platform (PaaS) for running applications in production.
- [Docker](https://www.docker.com/) - create, deploy, and run applications by using containers.
- [Docker Compose](https://github.com/docker/compose) - define and run multi-container applications with Docker.
- [Docker Swarm](https://github.com/docker/swarm) - Docker-native clustering system.
- [Kubernetes](https://kubernetes.io/) - automating deployment, scaling, and management of containerized applications.
- [LXC](https://linuxcontainers.org/) - lets Linux users easily create and manage system or application containers.
- [Rancher](https://rancher.com/) - lets you deliver Kubernetes-as-a-Service.
- [OpenVz](https://openvz.org/) - container-based virtualization for Linux.
- [Singularity](https://sylabs.io/singularity/) - run the application from the local environment to the cloud.
- [AppScale](https://github.com/AppScale/appscale) - easy-to-manage serverless platform for building and running scalable web and mobile applications.
- [Kata Containers](https://katacontainers.io/) - building lightweight virtual machines that seamlessly plug into the containers ecosystem.

## Container Image Registry

*Container Image registry.*

- [Quay](https://www.projectquay.io/) - container image registry that enables you to build, organize, distribute, and deploy containers.
- [Dockyard](https://github.com/Huawei/dockyard) - Container & Artifact Repository.

## Automation & Orchestration

*Tools for automation, orchestration, deployment, provisioning and configuration management.*

- [Ansible](https://www.ansible.com/) - simple IT automation platform that makes your applications and systems easier to deploy.
- [Salt](https://www.saltstack.com/) - automate the management and configuration of any infrastructure or application at scale.
- [Puppet](https://puppet.com/) - unparalleled infrastructure automation and delivery.
- [Chef](https://www.chef.io/) - automate infrastructure and applications.
- [Juju](https://jaas.ai/) - simplifies how you configure, scale and operate todays complex software.
- [Rundeck](https://www.rundeck.com/) - Runbook Automation For Modernizing Your Operations.
- [StackStorm](https://stackstorm.com/) - connects all your apps, services, and workflows. Automate DevOps your way.
- [Bosh](https://www.cloudfoundry.org/bosh/) - release engineering, deployment, and lifecycle management of complex distributed systems.
- [Cloudify](https://cloudify.co/) - Connect, Control, & Automate from core to edge: unlimited locations, clouds and devices.
- [Tsuru](https://tsuru.io/) - an extensible and open source Platform as a Service software.
- [Fabric](http://www.fabfile.org/) - high level Python library designed to execute shell commands remotely over SSH.
- [Capistrano](https://capistranorb.com/) - A remote server automation and deployment tool.
- [Mina](http://nadarei.co/mina/) - really fast deployer and server automation tool.
- [Terraform](https://www.terraform.io/) - use Infrastructure as Code to provision and manage any cloud, infrastructure, or service.
- [Packer](https://www.packer.io/) - build Automated Machine Images.
- [Vagrant](https://www.vagrantup.com/) - Development Environments Made Easy.
- [Foreman](https://theforeman.org/) - complete lifecycle management tool for physical and virtual servers.
- [Nomad](https://learn.hashicorp.com/nomad) - deploy and Manage Any Containerized, Legacy, or Batch Application.
- [Marathon](https://mesosphere.github.io/marathon/) - a production-grade container orchestration platform for DC/OS and Apache Mesos.

## Continuous Integration & Delivery

*Continuous Integration, Continuous Delivery and Continuous Delivery.*

- On premises
  - [Buildbot](http://buildbot.net/) - automate all aspects of the software development cycle.
  - [Gitlab CI](https://about.gitlab.com/product/continuous-integration/) - pipelines build, test, deploy, and monitor your code as part of a single, integrated workflow.
  - [Jenkins](http://jenkins-ci.org/) - automation server for building, deploying and automating any project.
  - [Drone](https://github.com/drone/drone) - a Container-Native, Continuous Delivery Platform.
  - [Concourse](https://concourse-ci.org/) - pipeline-based continuous thing-doer.
  - [Spinnaker](https://www.spinnaker.io/) - Fast, safe, repeatable deployments for every Enterprise.
  - [goCD](https://www.gocd.org/) - Delivery and Release Automation server.
  - [Teamcity](https://www.jetbrains.com/teamcity/) - enterprise-level CI and CD.
  - [Bamboo](https://www.atlassian.com/software/bamboo) - Tie automated builds, tests, and releases together in a single workflow.
  - [Integrity](http://integrity.github.io/) - Continuous Integration server.
  - [Zuul](https://zuul-ci.org/) - drives continuous integration, delivery, and deployment systems with a focus on project gating.
  - [Argo](https://argoproj.github.io/) - open source Kubernetes native workflows, events, CI and CD.
  - [Strider](https://strider-cd.github.io/) - Continuous Deployment/Continuous Integration platform.
- Web service
  - [Travis CI](https://travis-ci.org/) - easily sync your projects, you’ll be testing your code in minutes.
  - [Circle CI](https://circleci.com/) - powerful CI/CD pipelines that keep code moving.
  - [Bitrise](https://www.bitrise.io/) - CI/CD for mobile applications.
  - [Buildkite](https://buildkite.com/) - run fast, secure, and scalable continuous integration pipelines on your own infrastructure.
  - [Cirrus CI](https://cirrus-ci.org/) - cycle fast, efficient, and secure with modern cloud technologies.

## Source Code Management

*Source Code management, Git-repository manager, Version Control. Some of them include Code review.*

- [Github](https://github.com/) - helps developers store and manage their code, as well as track and control changes to their code.
- [Gitlab](https://gitlab.com/) - entire DevOps lifecycle in one application.
- [Bitbucket](https://bitbucket.org/product/) - gives teams one place to plan projects, collaborate on code, test, and deploy
- [Phabricator](https://github.com/phacility/phabricator/) - a collection of web applications which help software companies build better software.
- [Gogs](https://gogs.io/) - a painless self-hosted Git service.
- [Gitea](https://gitea.io/) - a painless self-hosted Git service.

## Web Servers

*Web servers and reverse proxy.*

- [Nginx](http://nginx.org/)
- [Apache](http://httpd.apache.org/)
- [Caddy](https://caddyserver.com/)
- [Cherokee](http://cherokee-project.com/)
- [Lighttpd](http://www.lighttpd.net/)
- [Uwsgi](https://github.com/unbit/uwsgi/)

## Databases

*Rational (SQL) and non-rational (NO-SQL) databases.*

- Rational (SQL)
  - [PostgreSQL](https://www.postgresql.org/)
  - [MySQL](https://www.mysql.com/)
  - [MariaDB](https://mariadb.org/)
  - [SQLite](https://sqlite.org/)
- Non-relational (No-SQL)
  - [Casandra](http://cassandra.apache.org/)
  - [Apache HBase](http://hbase.apache.org/)
  - [Couchdb](https://couchdb.apache.org/)
  - [Elasticsearch](https://www.elastic.co/products/elasticsearch)
  - [MongoDB](https://www.mongodb.com/)
  - [Ravendb](https://ravendb.net/)
  - [Rethinkdb](https://rethinkdb.com/)
  - Key-Value
    - [Couchbase](https://www.couchbase.com/)
    - [Leveldb](https://github.com/google/leveldb)
    - [Redis](https://redis.io/)
    - [RocksDB](https://rocksdb.org/)
    - [Etcd](https://github.com/etcd-io/etcd)

## Observability & Monitoring

*Observability, Monitoring, Metrics/Metrics collection and Alerting tools.*

- [Sensu](https://sensu.io/)
- [Alerta](https://github.com/alerta/alerta)
- [Cabot](https://cabotapp.com/)
- [Amon](https://github.com/amonapp/amon)
- [Flapjack](https://flapjack.io/)
- [Icinga](https://icinga.com/)
- [Monit](https://mmonit.com/monit/#home)
- [Naemon](http://www.naemon.org/)
- [Nagios](https://www.nagios.org/)
- [Sentry](https://sentry.io/welcome/)
- [Shinken](http://www.shinken-monitoring.org/)
- [Zabbix](https://www.zabbix.com/)
- [Glances](https://github.com/nicolargo/glances)
- Metrics/Metrics collection
  - [Prometheus](https://prometheus.io/)
  - [Collectd](https://github.com/collectd/collectd)
  - [Facette](https://github.com/facette/facette)
  - [Grafana](https://grafana.com/)
  - [Graphite](https://graphite.readthedocs.io/en/latest/)
  - [Influxdata](https://www.influxdata.com/)
  - [Netdata](https://www.netdata.cloud/)
- Logs Management
  - [Anthracite](https://github.com/Dieterbe/anthracite)
  - [Graylog](https://www.graylog.org/)
  - [Logstash](https://www.elastic.co/products/logstash#)
  - [Fluentd](https://www.fluentd.org/)
  - [Flume](https://flume.apache.org/)
  - [Heka](https://hekad.readthedocs.io/en/latest/#)
  - [Kibana](https://www.elastic.co/products/kibana)

## Service Discovery & Service Mesh

*Service Discovery, Service Mesh and Failure detection tools.*

- [Consul](https://www.hashicorp.com/products/consul/)
- [Serf](https://www.serf.io/)
- [Doozerd](https://github.com/ha/doozerd)
- [Zookeeper](http://zookeeper.apache.org/)
- [Etcd](https://etcd.io/)
- [Istio](https://istio.io/)
- [Kong](https://konghq.com/products/kong-gateway/kong-proxy)

## API Gateway

*API Gateway, Service Proxy and Service Management tools.*

- [API Umbrella](https://apiumbrella.io/#)
- [Ambassador](https://www.getambassador.io/)
- [Kong](https://konghq.com/)
- [Tyk](https://tyk.io/)
- [Cilium](https://github.com/cilium/cilium)
- [Gloo](https://github.com/solo-io/gloo)
- [Envoy](https://www.envoyproxy.io/)
- [Traefik](https://traefik.io/)
- [Nginx](https://nginx.org/)
- [Linkerd](https://github.com/linkerd/linkerd2)

## Code review

*Code review. In [Source Code Management](#source-code-management) section you can find few of them with Code review already as feature.*

- [Gerrit](https://www.gerritcodereview.com/)
- [Review Board](https://www.reviewboard.org/)

## Distributed messaging

*Distributed messaging platforms and Queues software.*

- [Rabbitmq](https://www.rabbitmq.com/)
- [Kafka](http://kafka.apache.org/)
- [Activemq](http://activemq.apache.org/)
- [Beanstalkd](https://beanstalkd.github.io/)
- [NSQ](https://nsq.io/)
- [Celery](http://www.celeryproject.org/)
- [Faktory](https://github.com/contribsys/faktory)
- [Nats](https://nats.io/)
- [RestMQ](http://restmq.com/)

## Programming Languages

*Programming languages.*

- [Pyhon](https://www.python.org/) - programming language that lets you work quickly and integrate systems more effectively.
- [Ruby](https://www.ruby-lang.org/) - a dynamic, open source programming language with a focus on simplicity and productivity.
- [Go](https://golang.org/) - is an open source programming language that makes it easy to build simple, reliable, and efficient software.

## Chat and ChatOps

*Chat and ChatOps.*

- [Rocket](https://rocket.chat/)
- [Mattermost](https://mattermost.com/)
- [Zulip](https://zulipchat.com/)
- [Riot](https://about.riot.im/)
- ChatOps:
  - [CloudBot](https://github.com/CloudBotIRC/CloudBot)
  - [Hubot](https://hubot.github.com/)
  - [Lita](https://www.lita.io/)

## Secret Management

*Security as code, sensitive credentials and secrets need to be managed, security, maintained and rotated using automation.*

- [Sops](https://github.com/mozilla/sops)
- [Vault](https://www.hashicorp.com/products/vault/)
- [Keybase](https://keybase.io/)

## Sharing

*A collection of tools to help with sharing knowledge and telling the story.*

- [Gitbook](https://github.com/GitbookIO/gitbook)
- [Docusaurus](https://github.com/facebook/docusaurus)
- [Docsify](https://github.com/docsifyjs/docsify/)
- [MkDocs](https://github.com/mkdocs/mkdocs/)

## Resources

### Books

*Books focused on DevOps and DevSecOps.*

- [Hands-On Security in DevOpss](https://www.packtpub.com/networking-and-servers/hands-security-devops)

### Conferences

- [DevOpsCon](https://devopscon.io/)
- [AWSre:Invent](https://reinvent.awsevents.com/)
- [DevSecOps](https://www.devseccon.com/)
- [ADDO](https://www.alldaydevops.com/)
- [DevOpsConnect](https://www.devopsconnect.com/)

## Contributing

Your contributions are always welcome! Please take a look at the [Contribution Guidelines](CONTRIBUTING.md).

## Authors

Created by *DevOps* for *DevOps*.
