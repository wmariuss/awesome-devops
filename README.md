# Awesome DevOps

[![Awesome](https://awesome.re/badge.svg)](https://awesome.re)
[![Deploy](https://github.com/wmariuss/awesome-devops/actions/workflows/deploy.yml/badge.svg)](https://github.com/wmariuss/awesome-devops/actions/workflows/deploy.yml)

A curated list of awesome DevOps tools, technologies, platforms and resources. Things to help/grow you in *DevOps* or *SRE* area.

- [Awesome DevOps](#awesome-devops)
  - [Cloud Platforms](#cloud-platforms)
  - [Open Source Cloud Platforms](#open-source-cloud-platforms)
  - [Operating Systems](#operating-systems)
  - [Distributed Filesystems](#distributed-filesystems)
  - [Applications Platforms](#applications-platforms)
  - [Container Image Registry](#container-image-registry)
  - [Automation & Orchestration](#automation--orchestration)
  - [Continuous Integration & Delivery](#continuous-integration--delivery)
  - [Source Code Management](#source-code-management)
  - [Web Servers](#web-servers)
  - [SSL](#ssl)
  - [Databases](#databases)
  - [Observability and Monitoring](#observability--monitoring)
  - [Service Discovery & Service Mesh](#service-discovery--service-mesh)
  - [Chaos Engineering](#chaos-engineering)
  - [API Gateway](#api-gateway)
  - [Code review](#code-review)
  - [Distributed messaging](#distributed-messaging)
  - [Programming Languages](#programming-languages)
  - [Chat and ChatOps](#chat-and-chatops)
  - [Secret Management](#secret-management)
  - [Sharing](#sharing)
  - [VPN](#vpn)
  - [Resources](#resources)
    - [Books](#books)
    - [Conferences](#conferences)
    - [DevOps Roadmap](#devops-roadmap)
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
- [IBM Cloud](https://www.ibm.com/cloud) - tools, data & APIs to make AI real now.
- [Stackpath](https://www.stackpath.com/) - platform of computing infrastructure and services built at the edge of the cloud.
- [Linode](https://www.linode.com/) - accelerate innovation in the cloud, virtual computing must be more accessible, affordable, and simple.

## Open Source Cloud Platforms

*Private, Public and Hybrid open source Cloud Platforms.*

- [Openstack](https://www.openstack.org/) - open source software for creating private and public clouds.
- [Apache CloudStack](https://cloudstack.apache.org/) - designed to deploy and manage large networks of virtual machines.
- [OpenNebula](https://opennebula.org/) - build Private Clouds and manage Data Center virtualization based on KVM, LXD and VMware.
- [Eucalyptus](https://www.eucalyptus.cloud/) - building AWS-compatible private and hybrid clouds.
- [DC/OS](https://dcos.io/) - distributed operating system based on the Apache Mesos distributed systems kernel.
- [Apache Mesos](http://mesos.apache.org/) - program against your datacenter like it’s a single pool of resources.
- [Localstack](https://github.com/localstack/localstack) - fully functional local AWS cloud stack. Develop and test your cloud & Serverless apps offline.

## Operating Systems

*Operating Systems - Server Platform.*

- [Ubuntu](https://ubuntu.com/)
- [CentOS](https://www.centos.org/)
- [CoreOS](http://coreos.com/) - the pioneering lightweight container host.
- [OSv](http://osv.io/) - versatile modular unikernel designed to run unmodified Linux applications securely on micro-VMs in the cloud.
- [Rancher OS](https://rancher.com/rancher-os) - a lightweight, secure Linux distribution, built from containers to run containers well.
- [Atomic](http://www.projectatomic.io/) - use immutable infrastructure to deploy and scale your containerized applications.
- [Photon](https://github.com/vmware/photon) - Linux container host optimized for cloud-native applications, cloud platforms, and VMware infrastructure.

## Distributed Filesystems

*Network distributed filesystems.*

- [Ceph](https://ceph.io/) - highly scalable object, block and file-based storage under one whole system.
- [Gluster](https://www.gluster.org/) - free and open source software scalable network filesystem.
- [LINBIT](https://www.linbit.com/en/) - create, remove, and replicate block storage devices for datacenter scale environments.
- [XtreemFS](http://www.xtreemfs.org/) - fault-tolerant distributed file system for all storage needs.
- [min.io](https://min.io/) - high performance, distributed object storage system.

## Applications Platforms

*Applications management platforms, Containers platform and Containers management.*

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
- [K3S](https://k3s.io/) - The certified Kubernetes distribution built for IoT and Edge computing.
- [Podman](https://github.com/containers/podman) - a tool for managing OCI containers and pods.

## Container Image Registry

*Container Image registry.*

- [Quay](https://www.projectquay.io/) - container image registry that enables you to build, organize, distribute, and deploy containers.
- [Dockyard](https://github.com/Huawei/dockyard) - Container & Artifact Repository.
- [Harbor](https://goharbor.io/) - an open source trusted cloud native registry project that stores, signs, and scans content.

## Automation & Orchestration

*Tools for automation, orchestration, deployment, provisioning and configuration management.*

- [Ansible](https://www.ansible.com/) - simple IT automation platform that makes your applications and systems easier to deploy.
- [Salt](https://www.saltstack.com/) - automate the management and configuration of any infrastructure or application at scale.
- [Puppet](https://puppet.com/) - unparalleled infrastructure automation and delivery.
- [Chef](https://www.chef.io/) - automate infrastructure and applications.
- [Juju](https://jaas.ai/) - simplifies how you configure, scale and operate today's complex software.
- [Rundeck](https://www.rundeck.com/) - Runbook Automation For Modernizing Your Operations.
- [StackStorm](https://stackstorm.com/) - connects all your apps, services, and workflows. Automate DevOps your way.
- [Bosh](https://www.cloudfoundry.org/bosh/) - release engineering, deployment, and lifecycle management of complex distributed systems.
- [Cloudify](https://cloudify.co/) - Connect, Control, & Automate from core to edge: unlimited locations, clouds and devices.
- [Tsuru](https://tsuru.io/) - an extensible and open source Platform as a Service software.
- [Fabric](http://www.fabfile.org/) - high level Python library designed to execute shell commands remotely over SSH.
- [Capistrano](https://capistranorb.com/) - A remote server automation and deployment tool.
- [Mina](http://nadarei.co/mina/) - really fast deployer and server automation tool.
- [Terraform](https://www.terraform.io/) - use Infrastructure as Code to provision and manage any cloud, infrastructure, or service.
- [Pulumi](https://www.pulumi.com/) - modern infrastructure as code platform that allows you to use familiar programming languages and tools to build, deploy, and manage cloud infrastructure.
- [Packer](https://www.packer.io/) - build Automated Machine Images.
- [Vagrant](https://www.vagrantup.com/) - Development Environments Made Easy.
- [Foreman](https://theforeman.org/) - complete lifecycle management tool for physical and virtual servers.
- [Nomad](https://learn.hashicorp.com/nomad) - deploy and Manage Any Containerized, Legacy, or Batch Application.
- [Marathon](https://mesosphere.github.io/marathon/) - a production-grade container orchestration platform for DC/OS and Apache Mesos.
- [Atlantis](https://github.com/runatlantis/atlantis) - Terraform Pull Request Automation.
- [OctoDNS](https://github.com/github/octodns) - managing DNS across multiple providers. DNS as code.
- [ManageIQ](https://www.manageiq.org/) - Manage containers, virtual machines, networks, and storage from a single platform.
- [Ignite](https://github.com/weaveworks/ignite) -  Open Source Virtual Machine (VM) manager with a container UX and built-in GitOps management.
- [Spacelift](https://spacelift.io/) - Flexible orchestration solution for IaC development.
- [Atlantis](https://www.runatlantis.io/) - Terraform Pull Request Automation.
- [Stacktape](https://stacktape.com) - Developer-friendly Infrastructure as a Code framework built on top of AWS.

## Continuous Integration & Delivery

*Continuous Integration, Continuous Delivery and Continuous Delivery. GitOps*

- On premises
  - [Buildbot](http://buildbot.net/) - automate all aspects of the software development cycle.
  - [Gitlab CI](https://about.gitlab.com/product/continuous-integration/) - pipelines build, test, deploy, and monitor your code as part of a single, integrated workflow.
  - [Jenkins](http://jenkins-ci.org/) - automation server for building, deploying and automating any project.
  - [Drone](https://github.com/drone/drone) - a Container-Native, Continuous Delivery Platform.
  - [Concourse](https://concourse-ci.org/) - pipeline-based continuous thing-doer.
  - [Spinnaker](https://www.spinnaker.io/) - fast, safe, repeatable deployments for every Enterprise.
  - [goCD](https://www.gocd.org/) - Delivery and Release Automation server.
  - [Teamcity](https://www.jetbrains.com/teamcity/) - enterprise-level CI and CD.
  - [Bamboo](https://www.atlassian.com/software/bamboo) - tie automated builds, tests, and releases together in a single workflow.
  - [Integrity](http://integrity.github.io/) - Continuous Integration server.
  - [Zuul](https://zuul-ci.org/) - drives continuous integration, delivery, and deployment systems with a focus on project gating.
  - [Argo](https://argoproj.github.io/) - Open Source Kubernetes native workflows, events, CI and CD.
  - [Strider](https://strider-cd.github.io/) - Continuous Deployment/Continuous Integration platform.
  - [Evergreen](https://github.com/evergreen-ci/evergreen) - A Distributed Continuous Integration System from MongoDB.
  - [werf](https://werf.io/) - Open Source CI/CD tool for building Docker images & deploying them to Kubernetes using a GitOps approach.
  - [Flux](https://github.com/fluxcd/flux) - automatically ensures that the state of your Kubernetes cluster matches the configuration you’ve supplied in Git.
  - [Flagger](https://github.com/weaveworks/flagger) - progressive delivery Kubernetes operator (Canary, A/B Testing and Blue/Green deployments).
  - [Tekton](https://tekton.dev/) - powerful and flexible open-source framework for creating CI/CD systems.
  - [PipeCD](https://pipecd.dev/) - Continuous Delivery for Declarative Kubernetes, Serverless and Infrastructure Applications.
  - [Gitploy](https://www.gitploy.io/) - Build the deployment system around GitHub in minutes.
- Public Services
  - [Travis CI](https://travis-ci.org/) - easily sync your projects, you’ll be testing your code in minutes.
  - [Circle CI](https://circleci.com/) - powerful CI/CD pipelines that keep code moving.
  - [Bitrise](https://www.bitrise.io/) - CI/CD for mobile applications.
  - [Buildkite](https://buildkite.com/) - run fast, secure, and scalable continuous integration pipelines on your own infrastructure.
  - [Cirrus CI](https://cirrus-ci.org/) - continuous integration system built for the era of cloud computing.
  - [Codefresh](https://codefresh.io/) - GitOps automation platform for Kubernetes apps.
  - [Github actions](https://github.com/features/actions) - GitHub Actions makes it easy to automate all your software workflows, now with world-class CI/CD.
  - [Kraken CI](https://kraken.ci/) - modern CI/CD, open-source, on-premise system that is highly scalable and focused on testing.
  - [Earthly](https://earthly.dev/) - Develop CI/CD pipelines locally and run them anywhere.

## Source Code Management

*Source Code management, Git-repository manager, Version Control. Some of them include [Code review](#code-review).*

- [Github](https://github.com/) - helps developers store and manage their code, as well as track and control changes to their code.
- [Gitlab](https://gitlab.com/) - entire DevOps lifecycle in one application.
- [Bitbucket](https://bitbucket.org/product/) - gives teams one place to plan projects, collaborate on code, test, and deploy
- [Phabricator](https://github.com/phacility/phabricator/) - a collection of web applications which help software companies build better software.
- [Gogs](https://gogs.io/) - a painless self-hosted Git service.
- [Gitea](https://gitea.io/) - a painless self-hosted Git service.
- [Gitblit](https://github.com/gitblit/gitblit) - pure Java Git solution for managing, viewing, and serving Git repositories.

## Web Servers

*Web servers and reverse proxy.*

- [Nginx](http://nginx.org/) - high performance load balancer, web server and reverse proxy.
- [Apache](http://httpd.apache.org/) - web server and reverse proxy.
- [Caddy](https://caddyserver.com/) - web server with automatic HTTPS.
- [Cherokee](http://cherokee-project.com/) - highly concurrent secured web applications.
- [Lighttpd](http://www.lighttpd.net/) - optimized for speed-critical environments while remaining standards-compliant, secure and flexible.
- [Uwsgi](https://github.com/unbit/uwsgi/) - application server container.

## SSL

*Tools for automating the management of SSL certificates.*

- [Certbot](https://github.com/certbot/certbot) - automate using Let’s Encrypt certificates on manually-managed websites to enable HTTPS.
- [Let’s Encrypt](https://letsencrypt.org/) - free, automated, and open Certificate Authority.
- [Cert Manager](https://github.com/jetstack/cert-manager) - K8S add-on to automate the management and issuance of TLS certificates from various issuing sources.

## Databases

*Relational (SQL) and non-relational (NoSQL) databases.*

- Relational (SQL)
  - [PostgreSQL](https://www.postgresql.org/) - powerful, open source object-relational database system.
  - [MySQL](https://www.mysql.com/) - open-source relational database management system.
  - [MariaDB](https://mariadb.org/) - fast, scalable and robust, with a rich ecosystem of storage engines, plugins and many other tools.
  - [SQLite](https://sqlite.org/) - small, fast, self-contained, high-reliability, full-featured, SQL database engine.
- Non-relational (NoSQL)
  - [Casandra](http://cassandra.apache.org/) - manage massive amounts of data, fast, without losing sleep.
  - [Apache HBase](http://hbase.apache.org/) - distributed, versioned, non-relational database.
  - [Couchdb](https://couchdb.apache.org/) - database that completely embraces the web.
  - [Elasticsearch](https://www.elastic.co/products/elasticsearch) - distributed, RESTful search and analytics engine capable of addressing a growing number of use cases.
  - [MongoDB](https://www.mongodb.com/) - general purpose, document-based, distributed database built for modern applications.
  - [Rethinkdb](https://github.com/rethinkdb/rethinkdb) - open-source database for the realtime web.
  - Key-Value
    - [Couchbase](https://www.couchbase.com/) - distributed  multi-model NoSQL document-oriented database that is optimized for interactive applications.
    - [Leveldb](https://github.com/google/leveldb) - fast key-value storage library.
    - [Redis](https://redis.io/) - in-memory data structure store, used as a database, cache and message broker.
    - [RocksDB](https://rocksdb.org/) - a library that provides an embeddable, persistent key-value store for fast storage.
    - [Etcd](https://github.com/etcd-io/etcd) - distributed reliable key-value store for the most critical data of a distributed system.

## Observability & Monitoring

*Observability, Monitoring, Metrics/Metrics collection and Alerting tools.*

- [Sensu](https://sensu.io/) - Simple. Scalable. Multi-cloud monitoring.
- [Alerta](https://github.com/alerta/alerta) - scalable, minimal configuration and visualization monitoring system.
- [Cabot](https://github.com/arachnys/cabot) - self-hosted, easily-deployable monitoring and alerts service.
- [Amon](https://github.com/amonapp/amon) - modern server monitoring platform.
- [Flapjack](https://flapjack.io/) - monitoring notification routing + event processing system.
- [Icinga](https://icinga.com/) - monitors availability and performance, gives you simple access to relevant data and raises alerts.
- [Monit](https://mmonit.com/monit/#home) - managing and monitoring Unix systems.
- [Naemon](http://www.naemon.org/) - fast, stable and innovative while giving you a clear view of the state of your network and applications.
- [Nagios](https://www.nagios.org/) - computer-software application that monitors systems, networks and infrastructure.
- [Sentry](https://sentry.io/welcome/) - error monitoring that helps all software teams discover, triage, and prioritize errors in real-time.
- [Shinken](http://www.shinken-monitoring.org/) - monitoring framework.
- [Zabbix](https://www.zabbix.com/) - mature and effortless monitoring solution for network monitoring and application monitoring.
- [Glances](https://github.com/nicolargo/glances) - monitoring information through a curses or Web based interface.
- [Healthchecks](https://github.com/healthchecks/healthchecks) - cron monitoring tool.
- [Bolo](http://bolo.niftylogic.com/) - building distributed, scalable monitoring systems.
- [cAdvisor](https://github.com/google/cadvisor) - analyzes resource usage and performance characteristics of running containers.
- [ElastiFlow](https://github.com/robcowart/elastiflow) - network flow monitoring (Netflow, sFlow and IPFIX) with the Elastic Stack.
- [Co-Pilot](https://pcp.io/) - system performance analysis toolkit.
- Metrics/Metrics collection
  - [Thundra Foresight](https://www.thundra.io/foresight) - visibility into CI pipeline by spotting test failures in no time.
  - [Prometheus](https://prometheus.io/) - power your metrics and alerting with a leading open-source monitoring solution.
  - [Collectd](https://github.com/collectd/collectd) - the system statistics collection daemon.
  - [Facette](https://github.com/facette/facette) - time series data visualization software.
  - [Grafana](https://grafana.com/) - analytics & monitoring solution for every database.
  - [Graphite](https://graphite.readthedocs.io/en/latest/) - store numeric time-series data and render graphs of this data on demand.
  - [Influxdata](https://www.influxdata.com/) - time series database.
  - [Netdata](https://www.netdata.cloud/) - instantly diagnose slowdowns and anomalies in your infrastructure.
  - [Freeboard](https://github.com/Freeboard/freeboard) - real-time dashboard builder for IOT and other web mashups.
- Logs Management
  - [Anthracite](https://github.com/Dieterbe/anthracite) - an event/change logging/management app.
  - [Graylog](https://github.com/Graylog2/graylog2-server) - free and open source log management.
  - [Logstash](https://www.elastic.co/products/logstash#) - collect, parse, transform logs.
  - [Fluentd](https://www.fluentd.org/) - data collector for unified logging layer.
  - [Flume](https://flume.apache.org/) - distributed, reliable, and available service for efficiently collecting, aggregating, and moving logs.
  - [Heka](https://hekad.readthedocs.io/en/latest/#) - stream processing software system.
  - [Kibana](https://www.elastic.co/products/kibana) - explore, visualize, discover data.
  - [Loki](https://github.com/grafana/loki) - horizontally-scalable, highly-available, multi-tenant log aggregation system inspired by Prometheus.
- Status
  - [Cachet](https://github.com/CachetHQ/Cachet) - beautiful and powerful open source status page system.

## Service Discovery & Service Mesh

*Service Discovery, Service Mesh and Failure detection tools.*

- [Consul](https://www.hashicorp.com/products/consul/) - connect and secure any service.
- [Serf](https://www.serf.io/) - decentralized cluster membership, failure detection, and orchestration.
- [Doozerd](https://github.com/ha/doozerd) - a consistent distributed data store.
- [Zookeeper](http://zookeeper.apache.org/) - centralized service for configuration, naming, providing distributed synchronization, and more.
- [Etcd](https://etcd.io/) - distributed, reliable key-value store for the most critical data of a distributed system.
- [Istio](https://istio.io/) - connect, secure, control, and observe services.
- [Kong](https://konghq.com/products/kong-gateway/kong-proxy) - deliver performance needed for microservices, service mesh, and cloud native deployments.
- [Linkerd](https://github.com/linkerd/linkerd2) - service mesh for Kubernetes and beyond.

## Chaos Engineering

*The discipline of experimenting on a distributed system in order to build confidence in the system's capability to withstand turbulent conditions in production.*

- [Chaos Toolkit](https://github.com/chaostoolkit) - the Open Source Platform for Chaos Engineering.
- [Chaos Monkey](https://github.com/Netflix/chaosmonkey) - a resiliency tool that helps applications tolerate random instance failures.
- [Toxiproxy](https://github.com/Shopify/toxiproxy) - simulate network and system conditions for chaos and resiliency testing.
- [Pumba](https://github.com/alexei-led/pumba) - chaos testing, network emulation and stress testing tool for containers.

## API Gateway

*API Gateway, Service Proxy and Service Management tools.*

- [API Umbrella](https://apiumbrella.io/#) - proxy that sits in front of your APIs.
- [Ambassador](https://www.getambassador.io/) - Kubernetes-Native API Gateway built on the Envoy Proxy.
- [Kong](https://konghq.com/) - connect all your microservices and APIs with the industry’s most performant, scalable and flexible API platform.
- [Tyk](https://tyk.io/) - API and service management platform.
- [Cilium](https://github.com/cilium/cilium) - API aware networking and security using BPF and XDP.
- [Gloo](https://github.com/solo-io/gloo) - feature-rich, Kubernetes-native ingress controller, and next-generation API gateway.
- [Envoy](https://www.envoyproxy.io/) - cloud-native high-performance edge/middle/service proxy.
- [Traefik](https://traefik.io/) - reverse proxy and load balancer for HTTP and TCP-based applications.
- [Nginx](https://nginx.org/) - high performance reverse proxy.

## Code review

*Code review. A few of the [Source Code Management](#source-code-management) tools have built-in code review features.*

- [Gerrit](https://www.gerritcodereview.com/) - web-based team code collaboration tool.
- [Review Board](https://www.reviewboard.org/) - web-based collaborative code review tool.

## Distributed messaging

*Distributed messaging platforms and Queues software.*

- [Rabbitmq](https://www.rabbitmq.com/) - message broker.
- [Kafka](http://kafka.apache.org/) - building real-time data pipelines and streaming apps.
- [Activemq](http://activemq.apache.org/) - Multi-Protocol messaging.
- [Beanstalkd](https://beanstalkd.github.io/) - simple, fast work queue.
- [NSQ](https://nsq.io/) - realtime distributed messaging platform.
- [Celery](http://www.celeryproject.org/) - asynchronous task queue/job queue based on distributed message passing.
- [Faktory](https://github.com/contribsys/faktory) - repository for background jobs within your application.
- [Nats](https://nats.io/) - simple, secure and high performance open source messaging system.
- [RestMQ](http://restmq.com/) - message queue which uses HTTP as transport.
- [Dkron](https://github.com/distribworks/dkron) - distributed, fault tolerant job scheduling system.
- [KubeMQ](https://kubemq.io/) - Kubernetes-native messaging platform.

## Programming Languages

*Programming languages.*

- [Python](https://www.python.org/) - programming language that lets you work quickly and integrate systems more effectively.
- [Ruby](https://www.ruby-lang.org/) - a dynamic, open source programming language with a focus on simplicity and productivity.
- [Go](https://golang.org/) - an open source programming language that makes it easy to build simple, reliable, and efficient software.

## Chat and ChatOps

*Chat and ChatOps.*

- [Rocket](https://rocket.chat/) - open source team communication.
- [Mattermost](https://mattermost.com/) - messaging platform that enables secure team collaboration.
- [Zulip](https://zulipchat.com/) - real-time chat with an email threading model.
- [Riot](https://about.riot.im/) - a universal secure chat app entirely under your control.
- ChatOps:
  - [CloudBot](https://github.com/CloudBotIRC/CloudBot) - simple, fast, expandable, open-source Python IRC Bot.
  - [Hubot](https://hubot.github.com/) - a customizable life embetterment robot.
  - [Lita](https://www.lita.io/) - a robot companion for your company's chat room.

## Secret Management

*Security as code, sensitive credentials and secrets need to be managed, security, maintained and rotated using automation.*

- [Sops](https://github.com/mozilla/sops) - simple and flexible tool for managing secrets.
- [Vault](https://www.hashicorp.com/products/vault/) - manage secrets and protect sensitive data.
- [Keybase](https://keybase.io/) - end-to-end encrypted chat and cloud storage system.
- [Vault Secrets Operator](https://github.com/ricoberger/vault-secrets-operator) - create Kubernetes secrets from Vault for a secure GitOps based workflow.
- [Git Secret](https://github.com/sobolevn/git-secret) - a bash-tool to store your private data inside a git repository.

## Sharing

*A collection of tools to help with sharing knowledge and telling the story.*

- [Gitbook](https://github.com/GitbookIO/gitbook) - modern documentation format and toolchain using Git and Markdown.
- [Docusaurus](https://github.com/facebook/docusaurus) - easy to maintain open source documentation websites.
- [Docsify](https://github.com/docsifyjs/docsify/) - a magical documentation site generator.
- [MkDocs](https://github.com/mkdocs/mkdocs/) - project documentation with Markdown.

## VPN

*VPN, routing and firewall.*

- [OpenVPN](https://openvpn.net/) - flexible VPN solutions to secure your data communications, whether it's for Internet privacy,
- [Pritunl](https://pritunl.com/) - enterprise Distributed OpenVPN and IPsec Server.
- [VyOS](https://vyos.io/) - open source network OS that runs on a wide range of hardware, virtual machines, and cloud providers.
- [Algo](https://github.com/trailofbits/algo) - set up a personal VPN in the cloud.
- [Streisand](https://github.com/StreisandEffect/streisand) - sets up a new VPN service nearly automatically.
- [Freelan](https://github.com/freelan-developers/freelan) - a peer-to-peer, secure, easy-to-setup, multi-platform, open-source, highly-configurable VPN software.
- [Sshuttle](https://github.com/sshuttle/sshuttle) - transparent proxy server that works as a poor man's VPN.
- [SoftEther](https://www.softether.org/) - An Open-Source Free Cross-platform Multi-protocol VPN Program,
as an academic project from University of Tsukuba, under the Apache License 2.0.
- [Firezone](https://www.firezone.dev/) - Self-hosted VPN server using WireGuard. Supports MFA, SSO, and has easy deployment options.

## Resources

### Books

*Books focused on DevOps, DevSecOps and Site Reliability Engineering.*

- [Effective DevOps: Building a Culture of Collaboration, Affinity, and Tooling at Scale](http://shop.oreilly.com/product/0636920039846.do)
- [Continuous Delivery: Reliable Software Releases through Build, Test, and Deployment Automation](https://www.oreilly.com/library/view/continuous-delivery-reliable/9780321670250/)
- [Hands-On Security in DevOps](https://www.packtpub.com/networking-and-servers/hands-security-devops)
- [Site Reliability Engineering](https://landing.google.com/sre/books/)
- [The Site Reliability Workbook](https://landing.google.com/sre/books)
- [Infrastructure as Code: Managing Servers in the Cloud](http://shop.oreilly.com/product/0636920039297.do)
- [The DevOps Handbook](https://www.oreilly.com/library/view/the-devops-handbook/9781457191381/)

### Conferences

- [DevOpsCon](https://devopscon.io/)
- [AWS re:Invent](https://reinvent.awsevents.com/)
- [DevSecOps](https://www.devseccon.com/)
- [ADDO](https://www.alldaydevops.com/)
- [DevOpsConnect](https://www.devopsconnect.com/)
- [@Scale](https://atscaleconference.com/)
- [devopsdays](https://devopsdays.org/)
- [DevOps Enterprise Summit](https://events.itrevolution.com/)

## DevOps Roadmap

Basic understanding and what you should know to become a *DevOps* Engineer, check the roadmap [here](https://roadmap.sh/devops).

## Contributing

Your contributions are always welcome! Please take a look at the [Contribution Guidelines](https://github.com/wmariuss/awesome-devops/blob/master/CONTRIBUTING.md).

## Authors

Created by *DevOps* for *DevOps*.

## License

[![License: CC0 1.0 Universal](https://img.shields.io/badge/License-CC0%201.0%20Universal-lightgrey.svg)](https://creativecommons.org/publicdomain/zero/1.0/)
