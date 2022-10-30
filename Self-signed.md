
https://devopscube.com/create-self-signed-certificates-openssl/
openssl req -x509 \
            -sha256 -days 356 \
            -nodes \
            -newkey rsa:2048 \
            -subj "/CN=192.168.0.122/C=US/L=San Fransisco" \
            -keyout rootCA.key -out rootCA.crt 
			
openssl genrsa -out server.key 2048			
			
openssl req -new -key server.key -out server.csr -config openssl.conf

---
cat > cert.conf <<EOF

authorityKeyIdentifier=keyid,issuer
basicConstraints=CA:FALSE
keyUsage = digitalSignature, nonRepudiation, keyEncipherment, dataEncipherment
subjectAltName = @alt_names

[alt_names]
IP.1 = 192.168.0.122

EOF
---


openssl x509 -req \
    -in server.csr \
    -CA rootCA.crt -CAkey rootCA.key \
    -CAcreateserial -out server.crt \
    -days 365 \
    -sha256 -extfile cert.conf
	
========================
Chu y: chỉ cần cái đặt rootCA.crt ở browser hoặc android

In Android 11, to install a CA certificate, users need to manually:
Open settings
Go to 'Security'
Go to 'Encryption & Credentials'
Go to 'Install from storage'
Select 'CA Certificate' from the list of types available
Accept a large scary warning
Browse to the certificate file on the device and open it
Confirm the certificate install : xem trong tab USER