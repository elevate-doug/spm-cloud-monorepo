For Windows Users:

Generate new SSL certificates and name them "spm.dev.local.crt" for the cert, "spm.dev.local.key" for the key. Add "127.0.0.1	spm.dev.local" to your hosts file. 

## To Generate SSL Certificates
1. Install openssl if you don't already have it
2. openssl genrsa -out CA-dev.local.key 2048
3. openssl req -new -x509 -sha256 -days 3650 -key .\CA-dev.local.key -out .\CA-dev.local.crt -config .\CA-openssl.cfg
4. openssl genrsa -out "spm.dev.local.key" 2048
5. openssl req -new -sha256 -key "spm.dev.local.key" -extensions v3_req -out "spm.dev.local.csr" -subj "/C=US/ST=State/L=City/O=Org/OU=Development/CN=spm.dev.local"
6. openssl x509 -req -sha256 -days 3650 -in "spm.dev.local.csr" -CA "CA-dev.local.crt" -CAkey "CA-dev.local.key" -CAcreateserial -extfile spm.dev.local.ss.cnf -out "spm.dev.local.crt"
7. openssl pkcs12 -export -out "spm.dev.local.pfx" -passout pass:123456 -inkey "spm.dev.local.key" -in "spm.dev.local.crt"
8. Double-click the resulting PFX file. When importing, include the private key and the password is "123456"

For Other Users:

I think it's roughly the same. Use openssl to generate the CA, keys, requests, certs, and fullchains. Import the resulting PFX file so that your OS recognizes the private key. Your local site should be trusted then.