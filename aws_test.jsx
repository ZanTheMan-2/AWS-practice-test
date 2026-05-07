import { useState, useEffect } from "react";

const ALL_QUESTIONS = [
  // ── COMPUTE (20) ──
  { id: 1, category: "Compute", question: "Which EC2 pricing model offers the largest discount but requires a 1 or 3-year commitment?", options: ["On-Demand", "Spot Instances", "Reserved Instances", "Dedicated Hosts"], answer: 2, explanation: "Reserved Instances offer up to 72% discount over On-Demand pricing in exchange for a 1 or 3-year commitment." },
  { id: 2, category: "Compute", question: "What is the maximum execution timeout for an AWS Lambda function?", options: ["5 minutes", "10 minutes", "15 minutes", "30 minutes"], answer: 2, explanation: "Lambda functions can run for a maximum of 15 minutes (900 seconds). For longer workloads, consider ECS, Batch, or Step Functions." },
  { id: 3, category: "Compute", question: "Which service lets you run containers without managing underlying servers?", options: ["EC2", "ECS on EC2", "AWS Fargate", "Elastic Beanstalk"], answer: 2, explanation: "AWS Fargate is a serverless compute engine — you define CPU and memory and AWS handles all server management." },
  { id: 4, category: "Compute", question: "What is an EC2 Spot Instance?", options: ["A reserved instance with a fixed price", "Unused EC2 capacity at up to 90% discount that can be interrupted", "A dedicated physical server", "An instance that runs only during business hours"], answer: 1, explanation: "Spot Instances use unused EC2 capacity at steep discounts but AWS can reclaim them with a 2-minute warning when capacity is needed." },
  { id: 5, category: "Compute", question: "Which EC2 feature automatically adjusts the number of instances based on demand?", options: ["Elastic Load Balancing", "Auto Scaling Groups", "AWS Fargate", "EC2 Fleet"], answer: 1, explanation: "Auto Scaling Groups automatically launch or terminate EC2 instances based on defined scaling policies." },
  { id: 6, category: "Compute", question: "What is the purpose of an AMI (Amazon Machine Image)?", options: ["To monitor EC2 performance", "To provide a template for launching EC2 instances", "To back up EBS volumes", "To configure VPC networking"], answer: 1, explanation: "An AMI is a pre-configured template containing the OS, application server, and applications needed to launch an EC2 instance." },
  { id: 7, category: "Compute", question: "Which AWS service provides a fully managed platform to deploy web applications without managing infrastructure?", options: ["EC2", "ECS", "Elastic Beanstalk", "Lambda"], answer: 2, explanation: "Elastic Beanstalk automatically handles deployment, capacity provisioning, load balancing, and monitoring." },
  { id: 8, category: "Compute", question: "What is EC2 Instance Store?", options: ["A managed database on EC2", "Temporary block-level storage physically attached to the host", "A persistent SSD volume", "An S3-backed storage option"], answer: 1, explanation: "Instance Store provides temporary block storage physically attached to the host. Data is lost when the instance stops or terminates." },
  { id: 9, category: "Compute", question: "What is the maximum memory you can allocate to a single Lambda function?", options: ["512 MB", "1 GB", "3 GB", "10 GB"], answer: 3, explanation: "Lambda supports memory from 128 MB to 10,240 MB (10 GB). CPU power scales proportionally with memory." },
  { id: 10, category: "Compute", question: "What is EC2 Dedicated Hosting?", options: ["Instances that share hardware with other customers", "Physical servers dedicated to a single customer", "Spot instances with guaranteed uptime", "Reserved instances with auto-scaling"], answer: 1, explanation: "Dedicated Hosts are physical servers fully dedicated to one customer, useful for compliance requirements and software licenses tied to cores/sockets." },
  { id: 11, category: "Compute", question: "Which EC2 instance family is optimized for memory-intensive workloads like in-memory databases?", options: ["C-family (Compute Optimized)", "M-family (General Purpose)", "R-family (Memory Optimized)", "I-family (Storage Optimized)"], answer: 2, explanation: "R-family instances (e.g., r6i) are Memory Optimized, designed for high-performance databases, distributed caches, and real-time big data analytics." },
  { id: 12, category: "Compute", question: "What is AWS Batch used for?", options: ["Batch file storage", "Running hundreds of thousands of batch computing jobs efficiently", "Batch messaging", "Scheduled Lambda executions"], answer: 1, explanation: "AWS Batch dynamically provisions optimal compute resources to run batch jobs, removing the need to manage compute infrastructure." },
  { id: 13, category: "Compute", question: "Which service allows you to run serverless containers triggered by events?", options: ["ECS on EC2", "AWS Fargate", "Lambda Container Images", "App Runner"], answer: 2, explanation: "Lambda Container Images let you package functions as containers up to 10 GB, combining Lambda's event-driven model with container flexibility." },
  { id: 14, category: "Compute", question: "What is AWS Outposts?", options: ["An edge CDN service", "AWS infrastructure delivered to your on-premises data center", "A cloud-based data center service", "A hybrid DNS solution"], answer: 1, explanation: "AWS Outposts brings native AWS services, infrastructure, and operating models to any on-premises facility for a consistent hybrid experience." },
  { id: 15, category: "Compute", question: "In EC2 Auto Scaling, what is a 'target tracking' scaling policy?", options: ["Manually setting min/max instance counts", "Scaling to maintain a specific metric at a target value (e.g., 60% CPU)", "Scaling based on a schedule", "Scaling based on SQS queue depth only"], answer: 1, explanation: "Target tracking automatically adjusts capacity to keep a chosen metric (like CPU utilization) at a specified target value, similar to a thermostat." },

  // ── STORAGE (20) ──
  { id: 16, category: "Storage", question: "Which S3 storage class is most cost-effective for data rarely accessed but requiring rapid retrieval?", options: ["S3 Standard", "S3 Glacier", "S3 Standard-IA", "S3 One Zone-IA"], answer: 2, explanation: "S3 Standard-IA is for infrequently accessed data needing millisecond retrieval. Lower storage cost but per-retrieval fees apply." },
  { id: 17, category: "Storage", question: "What is the maximum size of a single object in Amazon S3?", options: ["5 GB", "50 GB", "5 TB", "Unlimited"], answer: 2, explanation: "A single S3 object can be up to 5 TB. Objects larger than 5 GB must use the Multipart Upload API." },
  { id: 18, category: "Storage", question: "Which EBS volume type is best for high-performance databases requiring consistent low-latency IOPS?", options: ["Cold HDD (sc1)", "Throughput Optimized HDD (st1)", "General Purpose SSD (gp3)", "Provisioned IOPS SSD (io2)"], answer: 3, explanation: "io2 delivers consistent high-performance IOPS for I/O-intensive workloads, supporting up to 256,000 IOPS." },
  { id: 19, category: "Storage", question: "What is S3 Versioning used for?", options: ["Encrypting objects at rest", "Keeping multiple versions of an object to recover from accidental deletion", "Replicating objects across regions", "Restricting public access"], answer: 1, explanation: "S3 Versioning preserves every version of every object, enabling recovery from accidental deletions or overwrites." },
  { id: 20, category: "Storage", question: "Which storage service is designed for shared file storage accessible by multiple EC2 instances simultaneously?", options: ["Amazon EBS", "Amazon S3", "Amazon EFS", "Amazon FSx"], answer: 2, explanation: "Amazon EFS is a fully managed NFS file system that can be mounted on multiple EC2 instances simultaneously across Availability Zones." },
  { id: 21, category: "Storage", question: "What does S3 Transfer Acceleration do?", options: ["Compresses files before uploading", "Uses CloudFront edge locations to accelerate uploads to S3", "Automatically tiers data to cheaper storage classes", "Encrypts data during transfer"], answer: 1, explanation: "S3 Transfer Acceleration routes uploads through CloudFront's globally distributed edge locations, speeding up long-distance transfers." },
  { id: 22, category: "Storage", question: "Which S3 feature prevents objects from being deleted or overwritten for a specified retention period?", options: ["S3 Versioning", "S3 Lifecycle Policies", "S3 Object Lock", "S3 Replication"], answer: 2, explanation: "S3 Object Lock uses a WORM model to protect objects from deletion or modification, supporting compliance requirements like SEC and FINRA." },
  { id: 23, category: "Storage", question: "What is the minimum storage duration charge for S3 Glacier Flexible Retrieval?", options: ["30 days", "60 days", "90 days", "180 days"], answer: 2, explanation: "S3 Glacier Flexible Retrieval has a minimum storage duration of 90 days. Early deletion incurs a pro-rated charge." },
  { id: 24, category: "Storage", question: "What is the purpose of S3 Lifecycle policies?", options: ["Restrict who can access S3 buckets", "Automatically transition objects between storage classes or delete them based on age", "Enable cross-region replication", "Monitor S3 access patterns"], answer: 1, explanation: "Lifecycle policies automate transitions (Standard → IA → Glacier) and can expire objects based on age or version count." },
  { id: 25, category: "Storage", question: "What is Amazon FSx for Windows File Server?", options: ["A Linux-only file system", "A fully managed Windows-native file system built on Windows Server", "An object storage service", "A backup service for Windows EC2 instances"], answer: 1, explanation: "FSx for Windows File Server provides a fully managed native Windows file system supporting SMB protocol, NTFS, and Active Directory integration." },
  { id: 26, category: "Storage", question: "What is S3 Intelligent-Tiering?", options: ["A manual tiering process", "Automatically moves objects between access tiers based on usage patterns", "A fixed-cost storage class", "Encryption at rest for S3"], answer: 1, explanation: "S3 Intelligent-Tiering monitors access patterns and automatically moves objects to the most cost-effective tier — ideal for data with unpredictable access." },
  { id: 27, category: "Storage", question: "Can an EBS volume be attached to multiple EC2 instances simultaneously?", options: ["No, never", "Yes, using EBS Multi-Attach for io1/io2 volumes within the same AZ", "Yes, any EBS volume type", "Only gp3 volumes support this"], answer: 1, explanation: "EBS Multi-Attach allows a single io1 or io2 volume to be attached to up to 16 Nitro-based EC2 instances in the same AZ, useful for clustered applications." },
  { id: 28, category: "Storage", question: "What is an S3 Pre-Signed URL?", options: ["A permanent public URL for an S3 object", "A time-limited URL granting temporary access to a private S3 object", "A URL for cross-region replication", "An encrypted URL for KMS-protected objects"], answer: 1, explanation: "Pre-Signed URLs grant time-limited access to private S3 objects without changing bucket policies, useful for securely sharing files." },
  { id: 29, category: "Storage", question: "What is the durability of Amazon S3?", options: ["99.9%", "99.99%", "99.999999999% (11 nines)", "100%"], answer: 2, explanation: "S3 provides 99.999999999% (11 nines) durability by redundantly storing objects across multiple devices and multiple facilities within a region." },
  { id: 30, category: "Storage", question: "Which AWS storage service is best for a high-performance Lustre file system for HPC workloads?", options: ["Amazon EFS", "Amazon FSx for Lustre", "Amazon EBS io2", "Amazon S3"], answer: 1, explanation: "FSx for Lustre is a fully managed high-performance file system optimized for fast processing of workloads like ML, HPC, and media processing." },

  // ── NETWORKING (15) ──
  { id: 31, category: "Networking", question: "What does a VPC Internet Gateway enable?", options: ["VPC-to-VPC communication", "Communication between a VPC and the public internet", "Private connectivity to AWS services", "VPN connections to on-premises"], answer: 1, explanation: "An Internet Gateway (IGW) enables bidirectional communication between the VPC and the internet for resources with public IPs." },
  { id: 32, category: "Networking", question: "Which AWS service provides a global Content Delivery Network (CDN)?", options: ["AWS Global Accelerator", "Amazon CloudFront", "Elastic Load Balancer", "AWS Direct Connect"], answer: 1, explanation: "Amazon CloudFront is AWS's CDN that caches content at 450+ edge locations worldwide to reduce latency for end users." },
  { id: 33, category: "Networking", question: "What is the purpose of a NAT Gateway?", options: ["Allow inbound internet traffic to private subnets", "Allow outbound internet traffic from private subnets without exposing them", "Connect two VPCs together", "Provide DNS for VPCs"], answer: 1, explanation: "A NAT Gateway lets instances in private subnets initiate outbound internet connections while blocking unsolicited inbound connections." },
  { id: 34, category: "Networking", question: "What is VPC Peering?", options: ["Connecting a VPC to the internet", "A private connection between two VPCs using AWS's network", "A VPN tunnel to on-premises", "A way to share subnets between accounts"], answer: 1, explanation: "VPC Peering creates a private network connection between two VPCs (same or different accounts/regions) via the AWS backbone." },
  { id: 35, category: "Networking", question: "Which service provides a dedicated private connection from on-premises to AWS?", options: ["AWS VPN", "AWS Direct Connect", "AWS Transit Gateway", "VPC Peering"], answer: 1, explanation: "AWS Direct Connect provides a dedicated physical network connection between your data center and AWS with more consistent performance than the internet." },
  { id: 36, category: "Networking", question: "What does a Security Group do in AWS?", options: ["Encrypts data at the network level", "Acts as a stateful virtual firewall controlling inbound/outbound traffic for resources", "Monitors network flow logs", "Provides DDoS protection"], answer: 1, explanation: "Security Groups are stateful virtual firewalls at the instance level. Return traffic is automatically allowed regardless of outbound rules." },
  { id: 37, category: "Networking", question: "How does a Network ACL differ from a Security Group?", options: ["NACLs apply to instances; Security Groups apply to subnets", "NACLs are stateless at the subnet level; Security Groups are stateful at the instance level", "They are functionally identical", "NACLs only allow traffic; Security Groups can also deny"], answer: 1, explanation: "NACLs are stateless (return traffic must be explicitly allowed) at the subnet level. Security Groups are stateful at the instance level." },
  { id: 38, category: "Networking", question: "What is AWS Transit Gateway?", options: ["A managed VPN service", "A hub that connects multiple VPCs and on-premises networks at scale", "A content delivery network", "A DNS failover mechanism"], answer: 1, explanation: "Transit Gateway acts as a central hub for connecting thousands of VPCs and on-premises networks, simplifying complex network architectures." },
  { id: 39, category: "Networking", question: "Which Route 53 routing policy routes traffic based on the lowest network latency for the end user?", options: ["Simple", "Weighted", "Failover", "Latency-based"], answer: 3, explanation: "Latency-based routing directs users to the AWS region providing the lowest network latency, improving global application performance." },
  { id: 40, category: "Networking", question: "What is an Elastic IP address?", options: ["An IP that changes every time an instance restarts", "A static IPv4 address designed for dynamic cloud computing", "An IPv6 address for VPC resources", "A private IP for internal VPC routing"], answer: 1, explanation: "An Elastic IP is a static public IPv4 address you can allocate to your account and associate with any instance or network interface, persisting across stops/starts." },
  { id: 41, category: "Networking", question: "What is AWS PrivateLink?", options: ["A VPN service", "Private connectivity to AWS services and VPCs without traversing the public internet", "A dedicated network line", "A private DNS service"], answer: 1, explanation: "AWS PrivateLink provides private connectivity between VPCs, AWS services, and on-premises applications without exposing traffic to the internet." },
  { id: 42, category: "Networking", question: "What is the default VPC?", options: ["A VPC you must create before launching any resources", "A pre-configured VPC automatically created in each region with public subnets", "A private VPC with no internet access", "A VPC shared across all AWS accounts"], answer: 1, explanation: "Each AWS account gets a default VPC in every region with a default subnet in each AZ, an IGW, and a route table — ready for immediate use." },
  { id: 43, category: "Networking", question: "What is a VPC Endpoint?", options: ["An external IP for VPCs", "A private connection from your VPC to AWS services without using the internet", "A load balancer endpoint", "A DNS record for VPC resources"], answer: 1, explanation: "VPC Endpoints allow private communication between your VPC and supported AWS services without requiring an internet gateway, NAT device, or VPN." },
  { id: 44, category: "Networking", question: "What are the two types of VPC Endpoints?", options: ["Public and Private", "Interface Endpoints (ENI) and Gateway Endpoints (S3/DynamoDB)", "TCP and UDP Endpoints", "Regional and Global Endpoints"], answer: 1, explanation: "Interface Endpoints use Elastic Network Interfaces (ENIs) for most AWS services. Gateway Endpoints are free and used specifically for S3 and DynamoDB." },
  { id: 45, category: "Networking", question: "What is Amazon Route 53 used for?", options: ["A firewall service", "Managed DNS, domain registration, health checking, and traffic routing", "A CDN service", "A load balancing service"], answer: 1, explanation: "Route 53 is AWS's highly available DNS service. It also provides domain registration, health checking, and routing policies (weighted, failover, geolocation, etc.)." },

  // ── DATABASES (15) ──
  { id: 46, category: "Databases", question: "Which AWS service is compatible with MySQL/PostgreSQL but offers up to 5x better performance?", options: ["Amazon RDS", "Amazon DynamoDB", "Amazon Aurora", "Amazon Redshift"], answer: 2, explanation: "Amazon Aurora is cloud-native, offering up to 5x MySQL and 3x PostgreSQL throughput while being fully managed." },
  { id: 47, category: "Databases", question: "What type of database is Amazon DynamoDB?", options: ["Relational (SQL)", "Graph database", "NoSQL key-value and document", "In-memory cache"], answer: 2, explanation: "DynamoDB is a fully managed NoSQL database supporting key-value and document models with single-digit millisecond performance at any scale." },
  { id: 48, category: "Databases", question: "Which AWS service is best for data warehousing and OLAP?", options: ["Amazon RDS", "Amazon Aurora", "Amazon ElastiCache", "Amazon Redshift"], answer: 3, explanation: "Amazon Redshift is a petabyte-scale data warehouse optimized for complex analytical queries using columnar storage and MPP architecture." },
  { id: 49, category: "Databases", question: "What is Amazon ElastiCache used for?", options: ["Relational data storage", "Hosting NoSQL data", "In-memory caching to reduce database load and latency", "Storing data lake files"], answer: 2, explanation: "ElastiCache is a managed in-memory caching service supporting Redis and Memcached, reducing latency by caching frequent database queries." },
  { id: 50, category: "Databases", question: "What is DynamoDB DAX?", options: ["A backup service for DynamoDB", "An in-memory cache delivering microsecond performance for DynamoDB", "A DynamoDB replication feature", "A query language for DynamoDB"], answer: 1, explanation: "DynamoDB Accelerator (DAX) is a fully managed in-memory cache delivering up to 10x performance improvement, reducing response from ms to µs." },
  { id: 51, category: "Databases", question: "What is Amazon RDS Multi-AZ?", options: ["Distributing read traffic across multiple databases", "Synchronously replicating a database to a standby in another AZ for high availability", "A cross-region backup mechanism", "Running multiple database engines simultaneously"], answer: 1, explanation: "RDS Multi-AZ maintains a synchronous standby replica in a different AZ. AWS automatically fails over to it during maintenance or failure with no data loss." },
  { id: 52, category: "Databases", question: "What are RDS Read Replicas used for?", options: ["High availability failover", "Disaster recovery only", "Scaling read-heavy workloads by offloading read traffic", "Replacing the primary database"], answer: 2, explanation: "Read Replicas are asynchronous copies of the primary DB used to scale read-heavy workloads. They can be in the same AZ, different AZ, or different region." },
  { id: 53, category: "Databases", question: "What is Amazon Neptune?", options: ["A time-series database", "A managed graph database service", "A document database", "A key-value store"], answer: 1, explanation: "Amazon Neptune is a fully managed graph database supporting property graph (Gremlin) and RDF (SPARQL), ideal for social networks and knowledge graphs." },
  { id: 54, category: "Databases", question: "What does Aurora Serverless do?", options: ["Runs Aurora on Lambda", "Automatically starts, scales, and shuts down Aurora capacity based on application needs", "Provides read replicas for Aurora", "Migrates databases to Aurora"], answer: 1, explanation: "Aurora Serverless automatically adjusts database capacity based on actual usage — ideal for intermittent or unpredictable workloads with pay-per-use pricing." },
  { id: 55, category: "Databases", question: "What is Amazon DocumentDB?", options: ["A graph database", "A MongoDB-compatible managed document database service", "A columnar data warehouse", "A key-value cache"], answer: 1, explanation: "Amazon DocumentDB is a fully managed document database that is MongoDB-compatible, designed for JSON workloads at scale." },
  { id: 56, category: "Databases", question: "What is Amazon Keyspaces?", options: ["A key management service", "A managed Apache Cassandra-compatible database service", "A Redis-compatible cache", "A DynamoDB backup service"], answer: 1, explanation: "Amazon Keyspaces (for Apache Cassandra) is a scalable, serverless, managed database service compatible with Cassandra Query Language (CQL)." },
  { id: 57, category: "Databases", question: "What is Amazon Timestream?", options: ["A scheduled jobs service", "A fully managed time-series database for IoT and operational data", "A streaming analytics service", "A cron job scheduler"], answer: 1, explanation: "Amazon Timestream is purpose-built for time-series data (IoT sensors, application metrics, DevOps), storing and analyzing trillions of events per day." },
  { id: 58, category: "Databases", question: "What is DynamoDB Global Tables?", options: ["A feature for large table sizes", "Fully managed multi-region, multi-active replication for DynamoDB", "A backup feature for DynamoDB", "A table partitioning strategy"], answer: 1, explanation: "DynamoDB Global Tables automatically replicate data across multiple AWS regions, enabling low-latency access and high availability worldwide." },
  { id: 59, category: "Databases", question: "In RDS, what does 'automated backups' provide?", options: ["Manual snapshots only", "Point-in-time recovery within a retention window of 1-35 days", "Cross-region replication", "Read replica creation"], answer: 1, explanation: "RDS automated backups enable point-in-time recovery. AWS stores transaction logs every 5 minutes, allowing restore to any second within the retention period." },
  { id: 60, category: "Databases", question: "Which database service is recommended for caching session state in a web application?", options: ["Amazon RDS", "Amazon Redshift", "Amazon ElastiCache for Redis", "Amazon Aurora"], answer: 2, explanation: "ElastiCache for Redis is commonly used for session management, offering persistence, pub/sub, sorted sets, and sub-millisecond performance." },

  // ── SECURITY (15) ──
  { id: 61, category: "Security", question: "What is the AWS shared responsibility model?", options: ["AWS is responsible for everything", "Customers are responsible for everything", "AWS manages security OF the cloud; customers manage security IN the cloud", "Security is split 50/50"], answer: 2, explanation: "AWS secures the underlying infrastructure. Customers are responsible for data, identity, applications, OS config, and network/firewall settings." },
  { id: 62, category: "Security", question: "What does AWS CloudTrail do?", options: ["Monitors network traffic", "Logs all API calls and user activity across your AWS account", "Provides firewall rules for EC2", "Scans S3 for sensitive data"], answer: 1, explanation: "CloudTrail records every API call — who did what, when, and from where — providing an audit trail for governance and compliance." },
  { id: 63, category: "Security", question: "What is AWS KMS used for?", options: ["Storing passwords", "Creating and managing cryptographic keys for data encryption", "Monitoring access patterns", "Managing SSL certificates"], answer: 1, explanation: "AWS Key Management Service creates and controls encryption keys used to encrypt data across AWS services, with full audit trail in CloudTrail." },
  { id: 64, category: "Security", question: "Which AWS service protects against DDoS attacks?", options: ["AWS WAF", "AWS Shield", "AWS GuardDuty", "AWS Macie"], answer: 1, explanation: "AWS Shield protects against DDoS attacks. Shield Standard is free and automatic; Shield Advanced offers enhanced protection and 24/7 DRT support." },
  { id: 65, category: "Security", question: "What is AWS WAF?", options: ["A VPN service", "A web application firewall filtering malicious web traffic", "A network monitoring tool", "An intrusion detection system"], answer: 1, explanation: "AWS WAF protects against common web exploits (SQL injection, XSS) with customizable rules deployable on CloudFront, ALB, or API Gateway." },
  { id: 66, category: "Security", question: "What is Amazon GuardDuty?", options: ["A firewall service", "A managed threat detection service using ML to identify malicious activity", "A compliance auditing tool", "An encryption key manager"], answer: 1, explanation: "GuardDuty continuously analyzes VPC flow logs, DNS logs, and CloudTrail events using ML to detect threats like credential compromise and cryptomining." },
  { id: 67, category: "Security", question: "What does Amazon Macie do?", options: ["Manages IAM policies", "Discovers and protects sensitive data (like PII) in S3 using ML", "Monitors EC2 for vulnerabilities", "Scans code for security issues"], answer: 1, explanation: "Amazon Macie uses ML to automatically discover, classify, and protect sensitive data in S3, alerting on buckets with PII or unusual access patterns." },
  { id: 68, category: "Security", question: "What is the purpose of an IAM Role?", options: ["To store login credentials", "To grant temporary permissions to services or users without long-term keys", "To define network access rules", "To encrypt S3 objects"], answer: 1, explanation: "IAM Roles grant temporary security credentials to entities (EC2 instances, Lambda, cross-account users) without embedding long-term access keys." },
  { id: 69, category: "Security", question: "What is AWS Secrets Manager?", options: ["Managing IAM users", "Storing, rotating, and retrieving secrets like database credentials and API keys", "Encrypting EBS volumes", "Auditing resource configurations"], answer: 1, explanation: "Secrets Manager securely stores and automatically rotates secrets (e.g., RDS passwords) without manual intervention or code changes." },
  { id: 70, category: "Security", question: "What is Amazon Inspector?", options: ["A code review tool", "An automated security assessment service for EC2 and container workloads", "A network traffic analyzer", "A compliance reporting dashboard"], answer: 1, explanation: "Amazon Inspector automatically assesses EC2 instances and container images for vulnerabilities and unintended network exposure, providing risk scores." },
  { id: 71, category: "Security", question: "What is AWS Certificate Manager (ACM)?", options: ["A password vault", "A service for provisioning and managing SSL/TLS certificates", "A code signing service", "A CA for on-premises servers"], answer: 1, explanation: "ACM provisions, manages, and auto-renews SSL/TLS certificates for use with AWS services like CloudFront, ALB, and API Gateway — free of charge." },
  { id: 72, category: "Security", question: "What is an IAM Policy?", options: ["A list of IAM users", "A JSON document defining permissions for AWS actions and resources", "A network access control rule", "A VPC security configuration"], answer: 1, explanation: "IAM Policies are JSON documents attached to identities or resources that specify what actions are allowed or denied on which AWS resources." },
  { id: 73, category: "Security", question: "What is AWS Security Hub?", options: ["A firewall management console", "A centralized security posture management service aggregating findings across services", "A VPN hub", "A key rotation service"], answer: 1, explanation: "Security Hub provides a comprehensive view of security alerts and compliance status across AWS accounts, aggregating findings from GuardDuty, Inspector, Macie, and more." },
  { id: 74, category: "Security", question: "What does enabling MFA on an AWS root account do?", options: ["Encrypts all data in the account", "Requires a second authentication factor in addition to a password for root login", "Prevents all IAM users from logging in", "Automatically rotates root credentials"], answer: 1, explanation: "MFA on the root account requires a physical or virtual token in addition to the password, significantly reducing the risk of unauthorized root access." },
  { id: 75, category: "Security", question: "What is the principle of least privilege in IAM?", options: ["Using the cheapest IAM tier", "Granting only the minimum permissions needed to perform a task", "Restricting access to only root users", "Enabling all permissions by default"], answer: 1, explanation: "Least privilege means granting only the permissions a user or service needs — nothing more. This limits the blast radius if credentials are compromised." },

  // ── HIGH AVAILABILITY & DR (10) ──
  { id: 76, category: "High Availability", question: "What is the difference between an Availability Zone and an AWS Region?", options: ["They are the same", "A Region is a single data center; an AZ is a group of Regions", "A Region is a geographic area containing multiple isolated AZs", "AZs are virtual; Regions are physical"], answer: 2, explanation: "A Region (e.g., us-east-1) is a geographic area containing 2+ isolated Availability Zones. Each AZ has independent power, cooling, and networking." },
  { id: 77, category: "High Availability", question: "Which load balancer supports path-based and host-based routing for HTTP/HTTPS?", options: ["Classic Load Balancer", "Network Load Balancer", "Gateway Load Balancer", "Application Load Balancer"], answer: 3, explanation: "The ALB operates at Layer 7 and supports advanced routing — path-based, host-based, query string, and header-based routing." },
  { id: 78, category: "High Availability", question: "What is the RTO (Recovery Time Objective)?", options: ["The amount of data loss acceptable", "The maximum time allowed to restore a system after a failure", "The time between backups", "The cost of recovery operations"], answer: 1, explanation: "RTO is the maximum acceptable time to restore service after a disaster. Lower RTO requires more costly architectures." },
  { id: 79, category: "High Availability", question: "What is the RPO (Recovery Point Objective)?", options: ["The maximum time to restore a system", "The maximum acceptable data loss measured in time", "The recovery cost budget", "The number of replicas required"], answer: 1, explanation: "RPO defines how much data loss is acceptable. An RPO of 1 hour means up to 1 hour of data can be lost, requiring at least hourly backups." },
  { id: 80, category: "High Availability", question: "Which disaster recovery strategy provides the fastest RTO with the highest cost?", options: ["Backup and Restore", "Pilot Light", "Warm Standby", "Multi-Site Active-Active"], answer: 3, explanation: "Multi-Site Active-Active runs full production workloads in multiple regions simultaneously, providing near-zero RTO/RPO but at the highest cost." },
  { id: 81, category: "High Availability", question: "What is a Network Load Balancer best suited for?", options: ["HTTP routing with path rules", "Layer 4 TCP/UDP traffic requiring extreme performance and static IPs", "WebSocket connections", "Routing to Lambda functions"], answer: 1, explanation: "NLB operates at Layer 4 and handles millions of requests per second with ultra-low latency, supporting static IPs and preserving source IP." },
  { id: 82, category: "High Availability", question: "What is AWS Global Accelerator?", options: ["A CDN for static assets", "A service routing traffic through AWS's global network to improve availability and performance", "A DNS service", "A load balancer for Lambda"], answer: 1, explanation: "Global Accelerator uses AWS's backbone network with static anycast IPs to route traffic to optimal endpoints, reducing latency by up to 60%." },
  { id: 83, category: "High Availability", question: "What is the 'Pilot Light' disaster recovery strategy?", options: ["Running full capacity in both regions", "Keeping a minimal version of the environment running in a secondary region", "Only storing backups in another region", "Using serverless to eliminate infrastructure"], answer: 1, explanation: "Pilot Light keeps core systems (e.g., replicated DB) running in a secondary region. Recovery involves scaling up other services, providing low RTO at moderate cost." },
  { id: 84, category: "High Availability", question: "What does Amazon Route 53 health checking do?", options: ["Encrypts DNS queries", "Monitors the health of endpoints and routes traffic away from unhealthy ones", "Manages SSL certificates for DNS", "Prevents DNS spoofing"], answer: 1, explanation: "Route 53 health checks monitor endpoints (IP, domain, or CloudWatch alarm) and automatically reroute traffic to healthy resources during failures." },
  { id: 85, category: "High Availability", question: "What is the purpose of an Elastic Load Balancer health check?", options: ["To monitor billing costs", "To detect unhealthy instances and stop routing traffic to them", "To scale instances based on load", "To enforce SSL on all traffic"], answer: 1, explanation: "ELB health checks periodically test registered targets. Instances failing health checks are deregistered and traffic is rerouted to healthy instances." },

  // ── MONITORING & MANAGEMENT (10) ──
  { id: 86, category: "Monitoring", question: "Which service collects metrics, sets alarms, and reacts to changes in AWS resources?", options: ["AWS CloudTrail", "AWS Config", "Amazon CloudWatch", "AWS X-Ray"], answer: 2, explanation: "CloudWatch monitors AWS resources in real time — collecting metrics, logs, and events — and can trigger automated actions via alarms." },
  { id: 87, category: "Monitoring", question: "What does AWS X-Ray do?", options: ["Monitors S3 bucket access", "Traces requests through distributed applications to identify performance issues", "Logs API calls", "Monitors network traffic"], answer: 1, explanation: "AWS X-Ray provides end-to-end tracing for distributed applications, helping identify bottlenecks, errors, and latency across microservices." },
  { id: 88, category: "Monitoring", question: "What does AWS Config do?", options: ["Monitors application performance", "Records and evaluates resource configuration changes for compliance over time", "Collects VPC flow logs", "Manages deployment pipelines"], answer: 1, explanation: "AWS Config continuously records resource configuration changes and evaluates them against compliance rules, maintaining a full history." },
  { id: 89, category: "Monitoring", question: "What is Amazon EventBridge?", options: ["A message queue service", "A serverless event bus connecting applications using events from AWS and custom sources", "A monitoring dashboard", "An API gateway"], answer: 1, explanation: "EventBridge is a serverless event bus routing events from AWS services, SaaS apps, and custom sources to targets like Lambda, SQS, or Step Functions." },
  { id: 90, category: "Monitoring", question: "What are CloudWatch Logs Insights?", options: ["A cost analysis tool", "An interactive query service to analyze and search CloudWatch log data", "A metric dashboard builder", "A log archival service"], answer: 1, explanation: "CloudWatch Logs Insights lets you run queries against log data using a purpose-built query language to extract insights and troubleshoot issues." },
  { id: 91, category: "Monitoring", question: "What is AWS Systems Manager used for?", options: ["Managing financial budgets", "Operational management — patching, inventory, parameter storage, and remote access to EC2", "Database administration", "DNS management"], answer: 1, explanation: "Systems Manager provides a unified interface for operational tasks including patching (Patch Manager), configuration (Parameter Store), and session management (Session Manager)." },
  { id: 92, category: "Monitoring", question: "What is CloudWatch Contributor Insights?", options: ["IAM activity monitoring", "Analyzes log data to identify the top contributors impacting system performance", "A cost attribution tool", "A network traffic analyzer"], answer: 1, explanation: "Contributor Insights creates time-series graphs showing the top contributors (e.g., top IPs causing errors), helping identify problematic patterns in logs." },
  { id: 93, category: "Monitoring", question: "What is the purpose of AWS Personal Health Dashboard?", options: ["A public status page for all AWS services", "Personalized alerts about AWS events affecting your specific resources", "A cost monitoring dashboard", "A security compliance overview"], answer: 1, explanation: "AWS Personal Health Dashboard provides tailored alerts and guidance when AWS events (outages, maintenance) might affect your specific resources." },

  // ── COST (8) ──
  { id: 94, category: "Cost", question: "Which tool provides recommendations to optimize costs, performance, security, and fault tolerance?", options: ["AWS Cost Explorer", "AWS Budgets", "AWS Trusted Advisor", "AWS Pricing Calculator"], answer: 2, explanation: "Trusted Advisor inspects your environment and provides guidance across cost optimization, performance, security, fault tolerance, and service limits." },
  { id: 95, category: "Cost", question: "What does AWS Cost Explorer do?", options: ["Sets budget alerts", "Provides interactive charts to visualize and forecast AWS spending", "Recommends Reserved Instances only", "Audits IAM policies"], answer: 1, explanation: "Cost Explorer provides detailed visualizations of costs and usage over time with forecasting to help manage budgets proactively." },
  { id: 96, category: "Cost", question: "Which pricing model charges only when code is actually running?", options: ["EC2 On-Demand", "EC2 Reserved", "AWS Lambda", "EC2 Spot"], answer: 2, explanation: "Lambda charges per request and per GB-second of compute. You pay nothing when no code runs, making it cost-effective for intermittent workloads." },
  { id: 97, category: "Cost", question: "What are AWS Savings Plans?", options: ["Fixed-price hardware contracts", "Flexible pricing plans offering up to 72% savings for a consistent compute commitment", "Free tier extensions", "Budget alerts for cost overruns"], answer: 1, explanation: "Savings Plans offer significant discounts in exchange for a commitment to a consistent amount of compute usage ($/hour) for 1 or 3 years." },
  { id: 98, category: "Cost", question: "What is AWS Budgets used for?", options: ["Forecasting resource requirements", "Setting custom cost and usage budgets with automated alerts and actions", "Visualizing historical costs", "Comparing Reserved Instance prices"], answer: 1, explanation: "AWS Budgets lets you set custom thresholds and receive alerts when costs, usage, or RI/Savings Plan coverage exceeds defined limits." },
  { id: 99, category: "Cost", question: "What is the AWS Free Tier?", options: ["Free usage for all AWS services indefinitely", "Time-limited or always-free offers for new and existing AWS customers to try services at no cost", "Free support plan for all customers", "Free EC2 instances for startups"], answer: 1, explanation: "The AWS Free Tier includes three types: Always Free (e.g., Lambda 1M requests/month), 12-Month Free (e.g., EC2 t2.micro 750hrs), and Short-Term Trials." },
  { id: 100, category: "Cost", question: "Which purchasing option provides EC2 capacity reservations in a specific AZ?", options: ["Reserved Instances", "On-Demand Capacity Reservations", "Savings Plans", "Spot Fleet"], answer: 1, explanation: "On-Demand Capacity Reservations reserve compute capacity in a specific AZ for any duration without a commitment, ensuring capacity is available when needed." },

  // ── ARCHITECTURE & SERVICES (15) ──
  { id: 101, category: "Architecture", question: "Which service decouples application components using message queues?", options: ["Amazon SNS", "Amazon SQS", "Amazon Kinesis", "AWS Step Functions"], answer: 1, explanation: "Amazon SQS is a managed message queue that decouples and scales microservices. Producers and consumers operate independently." },
  { id: 102, category: "Architecture", question: "What is Amazon SNS used for?", options: ["Message queuing", "Pub/Sub messaging and push notifications to multiple subscribers simultaneously", "Stream processing", "API management"], answer: 1, explanation: "SNS is a pub/sub service. A message published to a topic fans out to many subscribers (SQS, Lambda, email, SMS, HTTP) simultaneously." },
  { id: 103, category: "Architecture", question: "What is AWS Step Functions?", options: ["A CI/CD pipeline tool", "A serverless workflow orchestration service that sequences AWS service calls as state machines", "A microservices framework", "A Lambda deployment tool"], answer: 1, explanation: "Step Functions orchestrates distributed workflows using visual state machines with built-in error handling, retries, and parallel execution." },
  { id: 104, category: "Architecture", question: "What is the purpose of Amazon API Gateway?", options: ["To manage DNS entries", "To create, publish, and manage secure APIs at scale", "To host web applications", "To cache database results"], answer: 1, explanation: "API Gateway is a fully managed service for creating RESTful, HTTP, and WebSocket APIs as a front door to Lambda, EC2, or other services." },
  { id: 105, category: "Architecture", question: "Which AWS service is used for real-time data stream processing?", options: ["Amazon SQS", "Amazon Kinesis Data Streams", "Amazon SNS", "AWS Glue"], answer: 1, explanation: "Kinesis Data Streams collects and processes large streams of data records in real time, enabling analytics, dashboards, and ML on live data." },
  { id: 106, category: "Architecture", question: "What is the principle of 'elasticity' in AWS?", options: ["Ability to store unlimited data", "Automatically scaling resources up and down based on demand", "Using multiple regions simultaneously", "High network throughput"], answer: 1, explanation: "Elasticity means infrastructure can expand and contract dynamically with demand, so you pay only for what you use without over-provisioning." },
  { id: 107, category: "Architecture", question: "What does AWS CloudFormation do?", options: ["Monitors infrastructure health", "Provisions AWS infrastructure using code templates (Infrastructure as Code)", "Deploys applications to EC2", "Manages DNS configurations"], answer: 1, explanation: "CloudFormation lets you model and provision AWS infrastructure using JSON/YAML templates, enabling repeatable and version-controlled deployments." },
  { id: 108, category: "Architecture", question: "What is AWS CDK (Cloud Development Kit)?", options: ["A CI/CD tool", "A framework for defining cloud infrastructure using familiar programming languages", "A container deployment service", "A monitoring SDK"], answer: 1, explanation: "AWS CDK lets you define cloud infrastructure in TypeScript, Python, Java, or C#, synthesizing into CloudFormation templates under the hood." },
  { id: 109, category: "Architecture", question: "What is Amazon Kinesis Data Firehose?", options: ["A real-time stream processor", "A fully managed service to load streaming data into data lakes, warehouses, and analytics services", "A message queue", "A log aggregation service"], answer: 1, explanation: "Kinesis Firehose is the easiest way to reliably load streaming data into S3, Redshift, OpenSearch, and Splunk — fully managed with no administration." },
  { id: 110, category: "Architecture", question: "What is AWS AppSync?", options: ["A deployment automation tool", "A managed GraphQL service for building real-time and offline data-driven applications", "A REST API builder", "A database synchronization tool"], answer: 1, explanation: "AppSync is a managed GraphQL service that simplifies app development by letting you create flexible APIs to query, mutate, and subscribe to data in real time." },
  { id: 111, category: "Architecture", question: "What is Amazon SQS FIFO queue?", options: ["A queue that processes messages faster", "A queue that guarantees exactly-once processing and strict ordering of messages", "A dead-letter queue", "A priority queue"], answer: 1, explanation: "FIFO queues guarantee that messages are processed exactly once and in the exact order they are sent, at up to 3,000 messages per second with batching." },
  { id: 112, category: "Architecture", question: "What is AWS Glue?", options: ["A database service", "A serverless ETL service for discovering, preparing, and integrating data for analytics", "A streaming service", "A data replication tool"], answer: 1, explanation: "AWS Glue is a serverless data integration service for extract, transform, load (ETL) operations, with a Data Catalog for metadata management." },
  { id: 113, category: "Architecture", question: "What is Amazon Athena?", options: ["A streaming analytics service", "An interactive query service for analyzing data in S3 using SQL", "A NoSQL database", "A data warehouse"], answer: 1, explanation: "Athena is serverless and lets you run SQL queries directly on data in S3 without loading it first, paying only per query scanned." },
  { id: 114, category: "Architecture", question: "What is AWS Lambda@Edge?", options: ["Lambda deployed on-premises", "Lambda functions that run at CloudFront edge locations to customize content delivery", "A Lambda high-memory variant", "Lambda for IoT devices"], answer: 1, explanation: "Lambda@Edge runs Lambda functions at CloudFront edge locations in response to viewer/origin requests, enabling dynamic content customization at low latency." },
  { id: 115, category: "Architecture", question: "What is the Well-Architected Framework's Reliability pillar focused on?", options: ["Reducing infrastructure costs", "Ensuring a workload can recover from failures and meet availability requirements", "Minimizing human error", "Optimizing resource utilization"], answer: 1, explanation: "The Reliability pillar covers automatic recovery from failure, horizontal scaling, stopping guessing capacity, and managing change through automation." },

  // ── MIGRATION & MISC (10) ──
  { id: 116, category: "Migration", question: "What is AWS Snowball used for?", options: ["Online data transfer acceleration", "Physically shipping large datasets to AWS using a secure hardware device", "Migrating databases online", "CDN content pre-loading"], answer: 1, explanation: "AWS Snowball is a petabyte-scale data transport device. You load data onto it, ship to AWS, and they import it into S3 — faster than internet transfer for large datasets." },
  { id: 117, category: "Migration", question: "What does AWS DMS (Database Migration Service) do?", options: ["Backs up on-premises databases", "Migrates databases to AWS with minimal downtime", "Optimizes database queries", "Creates database schemas"], answer: 1, explanation: "AWS DMS migrates databases to AWS quickly and securely. The source database remains operational during migration, minimizing downtime." },
  { id: 118, category: "Migration", question: "What is AWS Organizations?", options: ["Managing EC2 fleets", "Centrally managing and governing multiple AWS accounts", "Organizing S3 buckets", "Tagging resources across services"], answer: 1, explanation: "AWS Organizations lets you centrally manage billing, control access with Service Control Policies (SCPs), and automate account creation across multiple accounts." },
  { id: 119, category: "Migration", question: "What are Service Control Policies (SCPs) in AWS Organizations?", options: ["Security rules for individual EC2 instances", "Policies that set maximum permission boundaries for accounts in an organization", "IAM policies for root users", "Billing alerts for organizational units"], answer: 1, explanation: "SCPs are organization-level policies that act as guardrails — they restrict what actions are possible in member accounts, even for administrators." },
  { id: 120, category: "Migration", question: "What is the AWS Migration Hub?", options: ["A physical shipping service", "A central location to track the progress of application migrations to AWS", "A network gateway for migrations", "A cost calculator for migration projects"], answer: 1, explanation: "AWS Migration Hub provides a single place to discover existing servers, plan migrations, and track the status of each application migration." },
  { id: 121, category: "Migration", question: "What is AWS Application Discovery Service?", options: ["An app store for AWS services", "A service that helps plan migrations by collecting data about on-premises servers", "A service registry for microservices", "A testing tool for cloud migrations"], answer: 1, explanation: "Application Discovery Service collects configuration, usage, and behavior data from on-premises servers to help plan and scope AWS migrations." },
  { id: 122, category: "Migration", question: "What is AWS Snowflake Snowmobile?", options: ["A cold storage service", "An exabyte-scale data transfer service using a 45-foot shipping container truck", "A CDN edge service", "A mobile AWS console"], answer: 1, explanation: "AWS Snowmobile is a massive data transfer solution using a 45-foot ruggedized shipping container that can transfer up to 100 PB of data per trip." },
  { id: 123, category: "Migration", question: "What is the '6 Rs' framework in cloud migration?", options: ["A security compliance framework", "Migration strategies: Rehost, Replatform, Repurchase, Refactor, Retire, Retain", "A networking configuration model", "A cost optimization approach"], answer: 1, explanation: "The 6 Rs (also 7 Rs) describe migration strategies: Rehost (lift-and-shift), Replatform (lift-tinker-shift), Repurchase (move to SaaS), Refactor (re-architect), Retire, and Retain." },
  { id: 124, category: "Migration", question: "What is AWS Control Tower?", options: ["A network traffic controller", "A service to set up and govern a secure, multi-account AWS environment with best practices", "An EC2 management console", "A container orchestration service"], answer: 1, explanation: "Control Tower automates the setup of a landing zone — a secure, well-architected multi-account environment — applying guardrails via SCPs and AWS Config rules." },
  { id: 125, category: "Migration", question: "What does Amazon S3 Replication do?", options: ["Increases S3 performance", "Automatically copies objects to another S3 bucket in the same or different region", "Backs up EC2 instances to S3", "Versions all S3 objects automatically"], answer: 1, explanation: "S3 Replication (SRR for same-region, CRR for cross-region) automatically and asynchronously replicates objects between S3 buckets for compliance, DR, or latency reduction." },
];

const CATEGORIES = ["All", ...new Set(ALL_QUESTIONS.map(q => q.category))];
const STORAGE_KEY = "aws_test_tracker";

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const orange = "#FF9900";
const dark = "#0d1117";
const cardBg = "rgba(255,255,255,0.04)";
const borderCol = "rgba(255,255,255,0.08)";

function Badge({ text, color }) {
  return <span style={{ fontSize: 11, fontWeight: 600, padding: "3px 9px", borderRadius: 99, background: `${color}20`, color, border: `1px solid ${color}40` }}>{text}</span>;
}

export default function AWSTest() {
  const [screen, setScreen] = useState("home"); // home | quiz | summary
  const [mode, setMode] = useState(null); // "full" | "practice"
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [pool, setPool] = useState([]);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [revealed, setRevealed] = useState(false);
  const [answers, setAnswers] = useState([]);
  const [tracker, setTracker] = useState({}); // { [id]: { correct: N, wrong: N } }

  // Load tracker from storage
  useEffect(() => {
    async function load() {
      try {
        const result = await window.storage.get(STORAGE_KEY);
        if (result) setTracker(JSON.parse(result.value));
      } catch (_) {}
    }
    load();
  }, []);

  async function saveTracker(t) {
    setTracker(t);
    try { await window.storage.set(STORAGE_KEY, JSON.stringify(t)); } catch (_) {}
  }

  async function clearTracker() {
    setTracker({});
    try { await window.storage.delete(STORAGE_KEY); } catch (_) {}
  }

  function buildPool(cat, m) {
    const base = cat === "All" ? ALL_QUESTIONS : ALL_QUESTIONS.filter(q => q.category === cat);
    const shuffled = shuffle(base);
    return m === "practice" ? shuffled.slice(0, 10) : shuffled;
  }

  function startTest(m) {
    const p = buildPool(selectedCategory, m);
    setMode(m);
    setPool(p);
    setAnswers([]);
    setCurrent(0);
    setSelected(null);
    setRevealed(false);
    setScreen("quiz");
  }

  const q = pool[current];

  function handleReveal() {
    if (selected === null) return;
    setRevealed(true);
  }

  async function handleNext() {
    const correct = selected === q.answer;
    const newAnswers = [...answers, { correct, selectedIndex: selected, question: q }];
    setAnswers(newAnswers);
    // Update tracker
    const updated = { ...tracker };
    if (!updated[q.id]) updated[q.id] = { correct: 0, wrong: 0 };
    if (correct) updated[q.id].correct = (updated[q.id].correct || 0) + 1;
    else updated[q.id].wrong = (updated[q.id].wrong || 0) + 1;
    await saveTracker(updated);

    if (current + 1 >= pool.length) setScreen("summary");
    else { setCurrent(c => c + 1); setSelected(null); setRevealed(false); }
  }

  // ── HOME SCREEN ──
  if (screen === "home") {
    const totalAttempted = Object.keys(tracker).length;
    const totalCorrect = Object.values(tracker).reduce((s, v) => s + (v.correct > 0 ? 1 : 0), 0);
    const needsWork = ALL_QUESTIONS.filter(q => tracker[q.id] && tracker[q.id].wrong > 0 && (tracker[q.id].correct || 0) < tracker[q.id].wrong);
    const filteredCount = selectedCategory === "All" ? ALL_QUESTIONS.length : ALL_QUESTIONS.filter(q => q.category === selectedCategory).length;

    return (
      <div style={{ minHeight: "100vh", background: dark, padding: "28px 16px", fontFamily: "'Segoe UI', sans-serif", color: "white" }}>
        <div style={{ maxWidth: 580, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 28 }}>
            <div style={{ fontSize: 48, marginBottom: 8 }}>☁️</div>
            <h1 style={{ fontSize: 28, fontWeight: 800, margin: "0 0 4px" }}>AWS Practice Test</h1>
            <p style={{ color: "rgba(255,255,255,0.35)", margin: 0 }}>{ALL_QUESTIONS.length} questions · Shuffled every time</p>
          </div>

          {/* Stats bar */}
          {totalAttempted > 0 && (
            <div style={{ background: cardBg, border: `1px solid ${borderCol}`, borderRadius: 16, padding: "16px 20px", marginBottom: 20, display: "flex", gap: 20, justifyContent: "center", flexWrap: "wrap" }}>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 22, fontWeight: 800, color: orange }}>{totalAttempted}</div>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>Questions Seen</div>
              </div>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 22, fontWeight: 800, color: "#00c864" }}>{totalCorrect}</div>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>Mastered</div>
              </div>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 22, fontWeight: 800, color: "#ff5050" }}>{needsWork.length}</div>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>Needs Work</div>
              </div>
              <button onClick={clearTracker} style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.35)", borderRadius: 8, padding: "4px 12px", fontSize: 11, cursor: "pointer" }}>Reset Progress</button>
            </div>
          )}

          {/* Category filter */}
          <div style={{ marginBottom: 24 }}>
            <p style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 12 }}>Filter by category</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {CATEGORIES.map(c => (
                <button key={c} onClick={() => setSelectedCategory(c)} style={{ padding: "7px 14px", borderRadius: 99, border: `1px solid ${selectedCategory === c ? orange : "rgba(255,255,255,0.1)"}`, background: selectedCategory === c ? `${orange}18` : "transparent", color: selectedCategory === c ? orange : "rgba(255,255,255,0.45)", cursor: "pointer", fontSize: 12, fontWeight: 500 }}>
                  {c} {c !== "All" && <span style={{ opacity: 0.5 }}>({ALL_QUESTIONS.filter(q => q.category === c).length})</span>}
                </button>
              ))}
            </div>
          </div>

          {/* Mode cards */}
          <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 20 }}>
            {/* Full Test */}
            <div style={{ background: cardBg, border: `1px solid ${borderCol}`, borderRadius: 16, padding: 22, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
              <div>
                <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>📋 Full Test</div>
                <div style={{ fontSize: 13, color: "rgba(255,255,255,0.4)" }}>{filteredCount} questions · Shuffled · Detailed summary</div>
              </div>
              <button onClick={() => startTest("full")} style={{ background: orange, color: "#000", border: "none", borderRadius: 10, padding: "10px 22px", fontSize: 14, fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap" }}>Start →</button>
            </div>
            {/* Practice Mode */}
            <div style={{ background: "rgba(168,85,247,0.06)", border: "1px solid rgba(168,85,247,0.2)", borderRadius: 16, padding: 22, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
              <div>
                <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>⚡ Practice Mode</div>
                <div style={{ fontSize: 13, color: "rgba(255,255,255,0.4)" }}>10 random questions · Tracks correct & wrong per question</div>
              </div>
              <button onClick={() => startTest("practice")} style={{ background: "rgba(168,85,247,0.8)", color: "#fff", border: "none", borderRadius: 10, padding: "10px 22px", fontSize: 14, fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap" }}>Practice →</button>
            </div>
          </div>

          {/* Question tracker grid */}
          {totalAttempted > 0 && (
            <div style={{ background: cardBg, border: `1px solid ${borderCol}`, borderRadius: 16, padding: 20 }}>
              <p style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 14, margin: "0 0 14px" }}>Question Progress ({totalAttempted}/{ALL_QUESTIONS.length})</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                {ALL_QUESTIONS.map(q => {
                  const t = tracker[q.id];
                  let bg = "rgba(255,255,255,0.06)";
                  let color = "rgba(255,255,255,0.25)";
                  if (t) {
                    const net = (t.correct || 0) - (t.wrong || 0);
                    if (net > 0) { bg = "rgba(0,200,100,0.15)"; color = "#00c864"; }
                    else if (net < 0) { bg = "rgba(255,80,80,0.15)"; color = "#ff5050"; }
                    else { bg = "rgba(255,153,0,0.15)"; color = orange; }
                  }
                  return (
                    <div key={q.id} title={`Q${q.id}: ${q.question.slice(0, 60)}...`} style={{ width: 26, height: 26, borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 700, background: bg, color, border: `1px solid ${color}40` }}>
                      {q.id}
                    </div>
                  );
                })}
              </div>
              <div style={{ display: "flex", gap: 16, marginTop: 12, fontSize: 11, color: "rgba(255,255,255,0.35)" }}>
                <span><span style={{ color: "#00c864" }}>■</span> Mastered</span>
                <span><span style={{ color: "#ff5050" }}>■</span> Needs Work</span>
                <span><span style={{ color: orange }}>■</span> Mixed</span>
                <span><span style={{ color: "rgba(255,255,255,0.2)" }}>■</span> Unseen</span>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ── SUMMARY SCREEN ──
  if (screen === "summary") {
    const score = answers.filter(a => a.correct).length;
    const total = answers.length;
    const pct = Math.round((score / total) * 100);
    const byCategory = {};
    answers.forEach(a => {
      const cat = a.question.category;
      if (!byCategory[cat]) byCategory[cat] = { correct: 0, total: 0 };
      byCategory[cat].total++;
      if (a.correct) byCategory[cat].correct++;
    });
    const wrong = answers.filter(a => !a.correct);

    return (
      <div style={{ minHeight: "100vh", background: dark, padding: "28px 16px", fontFamily: "'Segoe UI', sans-serif", color: "white" }}>
        <div style={{ maxWidth: 680, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 24 }}>
            <div style={{ fontSize: 48, marginBottom: 6 }}>{pct >= 80 ? "🏆" : pct >= 60 ? "📈" : "📚"}</div>
            <h1 style={{ fontSize: 24, fontWeight: 800, margin: "0 0 4px" }}>
              {mode === "practice" ? "Practice Round Complete" : "Test Complete"}
            </h1>
            <p style={{ color: "rgba(255,255,255,0.35)", margin: 0 }}>{selectedCategory} · {mode === "practice" ? "Practice Mode" : "Full Test"}</p>
          </div>

          {/* Score */}
          <div style={{ background: cardBg, border: `1px solid ${borderCol}`, borderRadius: 18, padding: 24, marginBottom: 18, textAlign: "center" }}>
            <div style={{ fontSize: 50, fontWeight: 800, color: orange }}>{score}<span style={{ fontSize: 24, opacity: 0.4 }}>/{total}</span></div>
            <div style={{ color: "rgba(255,255,255,0.4)", marginTop: 4, marginBottom: 14, fontSize: 14 }}>{pct}% correct</div>
            <div style={{ background: "rgba(255,255,255,0.06)", borderRadius: 99, height: 10, overflow: "hidden", maxWidth: 360, margin: "0 auto" }}>
              <div style={{ height: "100%", width: `${pct}%`, background: pct >= 80 ? "#00c864" : pct >= 60 ? orange : "#ff5050", borderRadius: 99 }} />
            </div>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.35)", marginTop: 14, marginBottom: 0 }}>
              {pct >= 80 ? "Excellent command of AWS!" : pct >= 60 ? "Good effort. Review the categories below." : "Keep studying — focus on the core service categories."}
            </p>
          </div>

          {/* Answer grid */}
          <div style={{ background: cardBg, border: `1px solid ${borderCol}`, borderRadius: 18, padding: 20, marginBottom: 18 }}>
            <p style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", textTransform: "uppercase", letterSpacing: 1.5, margin: "0 0 14px" }}>Answer Overview</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {answers.map((a, i) => (
                <div key={i} title={`Q${i + 1}: ${a.question.question}`} style={{ width: 34, height: 34, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, background: a.correct ? "rgba(0,200,100,0.12)" : "rgba(255,80,80,0.12)", border: `2px solid ${a.correct ? "#00c864" : "#ff5050"}`, color: a.correct ? "#00c864" : "#ff5050" }}>
                  {i + 1}
                </div>
              ))}
            </div>
          </div>

          {/* Category breakdown */}
          {Object.keys(byCategory).length > 1 && (
            <div style={{ background: cardBg, border: `1px solid ${borderCol}`, borderRadius: 18, padding: 20, marginBottom: 18 }}>
              <p style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", textTransform: "uppercase", letterSpacing: 1.5, margin: "0 0 18px" }}>Performance by Category</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {Object.entries(byCategory).sort((a, b) => (a[1].correct / a[1].total) - (b[1].correct / b[1].total)).map(([cat, stats]) => {
                  const catPct = Math.round((stats.correct / stats.total) * 100);
                  const bar = catPct >= 80 ? "#00c864" : catPct >= 60 ? orange : "#ff5050";
                  return (
                    <div key={cat}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5, fontSize: 13 }}>
                        <span style={{ color: "rgba(255,255,255,0.7)" }}>{cat}</span>
                        <span style={{ color: bar, fontWeight: 700 }}>{stats.correct}/{stats.total} ({catPct}%)</span>
                      </div>
                      <div style={{ background: "rgba(255,255,255,0.06)", borderRadius: 99, height: 7, overflow: "hidden" }}>
                        <div style={{ height: "100%", width: `${catPct}%`, background: bar, borderRadius: 99 }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Wrong answers review */}
          {wrong.length > 0 && (
            <div style={{ background: cardBg, border: `1px solid ${borderCol}`, borderRadius: 18, padding: 20, marginBottom: 20 }}>
              <p style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", textTransform: "uppercase", letterSpacing: 1.5, margin: "0 0 18px" }}>Review Incorrect Answers ({wrong.length})</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
                {wrong.map((a, i) => (
                  <div key={i} style={{ borderLeft: "3px solid #ff5050", paddingLeft: 16 }}>
                    <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 8 }}>
                      <Badge text={a.question.category} color={orange} />
                    </div>
                    <p style={{ fontSize: 14, fontWeight: 600, color: "rgba(255,255,255,0.85)", margin: "0 0 10px", lineHeight: 1.5 }}>{a.question.question}</p>
                    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                      <div style={{ fontSize: 13, padding: "8px 12px", borderRadius: 8, background: "rgba(255,80,80,0.08)", border: "1px solid rgba(255,80,80,0.25)", color: "#ff8080" }}>
                        ✗ Your answer: {a.question.options[a.selectedIndex]}
                      </div>
                      <div style={{ fontSize: 13, padding: "8px 12px", borderRadius: 8, background: "rgba(0,200,100,0.08)", border: "1px solid rgba(0,200,100,0.25)", color: "#00c864" }}>
                        ✓ Correct: {a.question.options[a.question.answer]}
                      </div>
                    </div>
                    <p style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", margin: "10px 0 0", lineHeight: 1.65 }}>💡 {a.question.explanation}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
            <button onClick={() => startTest(mode)} style={{ background: orange, color: "#000", border: "none", borderRadius: 11, padding: "12px 28px", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>
              {mode === "practice" ? "Next 10 →" : "Retake (Reshuffled)"}
            </button>
            <button onClick={() => setScreen("home")} style={{ background: "transparent", color: "rgba(255,255,255,0.5)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 11, padding: "12px 28px", fontSize: 14, cursor: "pointer" }}>Back to Home</button>
          </div>
        </div>
      </div>
    );
  }

  // ── QUIZ SCREEN ──
  const isPractice = mode === "practice";
  return (
    <div style={{ minHeight: "100vh", background: dark, display: "flex", alignItems: "center", justifyContent: "center", padding: 24, fontFamily: "'Segoe UI', sans-serif", color: "white" }}>
      <div style={{ maxWidth: 640, width: "100%" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <div>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <span style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: 1 }}>
                {isPractice ? "⚡ Practice Mode" : "📋 Full Test"}
              </span>
            </div>
            <div style={{ fontSize: 13, color: orange, fontWeight: 600, marginTop: 2 }}>{q.category}</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.3)" }}>Question</div>
            <div style={{ fontSize: 18, fontWeight: 700 }}>{current + 1}<span style={{ color: "rgba(255,255,255,0.25)", fontWeight: 400, fontSize: 13 }}>/{pool.length}</span></div>
          </div>
        </div>

        <div style={{ background: isPractice ? "rgba(168,85,247,0.15)" : "rgba(255,153,0,0.1)", borderRadius: 99, height: 5, marginBottom: 20, overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${(current / pool.length) * 100}%`, background: isPractice ? "#a855f7" : orange, borderRadius: 99, transition: "width 0.3s" }} />
        </div>

        <div style={{ background: cardBg, border: `1px solid ${borderCol}`, borderRadius: 20, padding: 24, marginBottom: 12 }}>
          <p style={{ fontSize: 17, fontWeight: 600, lineHeight: 1.55, margin: "0 0 20px" }}>{q.question}</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {q.options.map((opt, i) => {
              let bg = "rgba(255,255,255,0.03)";
              let bc = "rgba(255,255,255,0.07)";
              let color = "rgba(255,255,255,0.75)";
              let icon = null;
              if (revealed) {
                if (i === q.answer) { bg = "rgba(0,200,100,0.1)"; bc = "#00c864"; color = "#00c864"; icon = "✓"; }
                else if (i === selected) { bg = "rgba(255,80,80,0.1)"; bc = "#ff5050"; color = "#ff5050"; icon = "✗"; }
              } else if (selected === i) {
                bg = isPractice ? "rgba(168,85,247,0.12)" : "rgba(255,153,0,0.1)";
                bc = isPractice ? "#a855f7" : orange;
                color = isPractice ? "#c084fc" : orange;
              }
              return (
                <div key={i} onClick={() => !revealed && setSelected(i)} style={{ background: bg, border: `1px solid ${bc}`, borderRadius: 12, padding: "13px 16px", cursor: revealed ? "default" : "pointer", color, fontSize: 14, display: "flex", alignItems: "center", gap: 12, transition: "all 0.15s" }}>
                  <span style={{ width: 26, height: 26, borderRadius: "50%", border: "1.5px solid currentColor", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, flexShrink: 0, opacity: 0.6 }}>
                    {String.fromCharCode(65 + i)}
                  </span>
                  <span style={{ flex: 1 }}>{opt}</span>
                  {icon && <span style={{ fontWeight: 700, fontSize: 15 }}>{icon}</span>}
                </div>
              );
            })}
          </div>
        </div>

        {revealed && (
          <div style={{ background: "rgba(255,153,0,0.07)", border: "1px solid rgba(255,153,0,0.2)", borderRadius: 14, padding: "14px 18px", marginBottom: 12, fontSize: 13, color: "rgba(255,255,255,0.6)", lineHeight: 1.65 }}>
            <span style={{ color: orange, fontWeight: 700 }}>💡 </span>{q.explanation}
          </div>
        )}

        {!revealed ? (
          <button onClick={handleReveal} disabled={selected === null} style={{ width: "100%", background: selected !== null ? (isPractice ? "#a855f7" : orange) : "rgba(255,255,255,0.05)", color: selected !== null ? (isPractice ? "#fff" : "#000") : "rgba(255,255,255,0.2)", border: "none", borderRadius: 12, padding: 14, fontSize: 15, fontWeight: 700, cursor: selected !== null ? "pointer" : "not-allowed", transition: "all 0.2s" }}>
            Check Answer
          </button>
        ) : (
          <button onClick={handleNext} style={{ width: "100%", background: isPractice ? "#a855f7" : orange, color: isPractice ? "#fff" : "#000", border: "none", borderRadius: 12, padding: 14, fontSize: 15, fontWeight: 700, cursor: "pointer" }}>
            {current + 1 >= pool.length ? "See Summary →" : "Next Question →"}
          </button>
        )}
      </div>
    </div>
  );
}
