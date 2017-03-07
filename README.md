EmployeeDirectory
=================

Fork from avaldes.com, no Maven

How to deploy on Bluemix
------------------------

### Create MongoDB database with Compose

1.  Log on to Bluemix, click on the Catalog, search for MongoDB, click on
    Compose for MongoDB, click on Create.

2.  Wait a few minutes for the provisioning. Find the credentials in the
    instance properties.

### Create the truststore

1.  Obtain the certificate from the MongoDB instance. There are a couple of ways
    to do that. One is by the credentials of the Compose for MongoDB service you
    just created:

    1.  Copy the property “ca_certificate_base64” to a text file

    2.  Use a tool to decode the certificate. You’ll get a resulting file that
        is surrounded with BEGIN CERTIFICATE and END CERTIFICATE. Name the file
        mongocert.crt.

2.  Or you can obtain the certificate directly from the DB using the command:

    openssl s_client -showcerts -connect
    \<your_mongoDB_hostname\>:\<your_mongoDB_port\>

    Example:  
    openssl s_client -showcerts -connect
    bluemix-sandbox-dal-9-portal.2.dblayer.com:23607

    Copy the content between the lines BEGIN CERTIFICATE and END CERTIFICATE and
    create a new file named mongocert.crt

3.  Create a truststore with that certificate:

    keytool -import -alias compose -file ./\<name_of_your_cert_file\> -keystore
    ./mongostore.jks -storetype jks -storepass \<your_truststore_password\>

    Example:  
    keytool -import -alias compose -file ./mongodbcert.crt -keystore
    ./mongostore.jks -storetype jks -storepass ilikeamiga

    *Please use mongostore.jks as the name of the truststore.*

### Copy the truststore to your Java project

1.  Copy the truststore file to the /src/main/resources folder, replacing the
    one that is there. Please use the same name “mongostore.jks”.

### Load the database

1.  Use the MongoDB client of your choice, such as Robomongo, and load the
    contents of the employees.json file. You can find this file under the
    /src/main/resources folder. Compose for MongoDB uses only SSL connections.
    You will need to include the certificate above in order to connect your
    client to your MongoDB instance.

    If you’re using the command line interface to connect to the database, it
    would be something like this:

    mongo --ssl --sslAllowInvalidCertificates
    \<your_mongoDB_hostname\>:\<your_mongoDB_port\>/admin -u admin -p
    \<your_mongoDB_password\> --sslCAFile mongodbcert.crt

    Example:  
    mongo --ssl --sslAllowInvalidCertificates
    bluemix-sandbox-dal-9-portal.2.dblayer.com:23607/admin -u admin -p
    LLBRYSVQYJQGFTOS --sslCAFile mongodbcert.crt

### Change application.properties

1.  Change the application.properties
    (src/main/webapp/WEB-INF/application.properties) file to match these
    credentials above:

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
databaseName = employees
trustStore = /home/vcap/app/WEB-INF/classes/mongostore.jks
trustStorePassword = <your_truststore_password>
host = <your_mongoDB_hostname>
port = <your_mongoDB_port>
credentials = <your_mongoDB_user>:<your_mongoDB_password>@employees?uri.authMechanism=SCRAM-SHA-1
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

### Deploy code

1.  Build the app by running **mvn package** from the application root.

2.  Change directory to target where the following files reside:

    -   EmployeeDirectory.war

    -   manifest.yml

3.  Run **cf push**
