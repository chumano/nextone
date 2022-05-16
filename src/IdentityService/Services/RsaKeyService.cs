using Microsoft.Extensions.Hosting;
using Microsoft.IdentityModel.Tokens;
using Newtonsoft.Json;
using Serilog;
using System;
using System.IO;
using System.Security.Cryptography;

namespace IdentityService.Services
{
    public class RsaKeyService
    {
        /// <summary>
        /// This points to a JSON file in the format: 
        /// {
        ///  "Modulus": "",
        ///  "Exponent": "",
        ///  "P": "",
        ///  "Q": "",
        ///  "DP": "",
        ///  "DQ": "",
        ///  "InverseQ": "",
        ///  "D": ""
        /// }
        /// </summary>
        private string _file
        {
            get
            {
                return Path.Combine(_environment.ContentRootPath, "Config", "rsakey.json");
            }
        }
        private readonly IHostEnvironment _environment;
        private readonly TimeSpan _timeSpan;

        public RsaKeyService(IHostEnvironment environment, TimeSpan timeSpan)
        {
            _environment = environment;
            _timeSpan = timeSpan;
            //create config folder
            Directory.CreateDirectory(Path.Combine(environment.ContentRootPath, "Config"));
        }

        public bool NeedsUpdate()
        {
            if (File.Exists(_file))
            {
                var creationDate = File.GetLastWriteTime(_file);
                var span = DateTime.Now.Subtract(creationDate);
                //return span > _timeSpan;
                return false;
            }
            return true;
        }

        public RSAParameters GetRandomKey()
        {
            //using (var rsa = new RSACryptoServiceProvider(2048)) //ko hỗ trợ trên docker
            using (var rsa = RSA.Create(2048))
            {
                try
                {
                    return rsa.ExportParameters(true);
                }
                finally
                {
                    //new RSACryptoServiceProvider(2048))
                    //rsa.PersistKeyInCsp = false;
                }
            }
        }

        public RsaKeyService GenerateKeyAndSave(bool forceUpdate = false)
        {
            if (forceUpdate || NeedsUpdate())
            {
                Log.Debug($"[RsaKeyService] GenerateKeyAndSave {_file}");
                var p = GetRandomKey();
                RSAParametersWithPrivate t = new RSAParametersWithPrivate();
                t.SetParameters(p);
                File.WriteAllText(_file, JsonConvert.SerializeObject(t, Formatting.Indented));
            }
            return this;
        }

        /// <summary>
        /// 
        /// Generate 
        /// </summary>
        /// <param name="file"></param>
        /// <returns></returns>
        public RSAParameters GetKeyParameters()
        {
            if (!File.Exists(_file)) throw new FileNotFoundException("Check configuration - cannot find auth key file: " + _file);
            var keyParams = JsonConvert.DeserializeObject<RSAParametersWithPrivate>(File.ReadAllText(_file));
            return keyParams.ToRSAParameters();
        }

        //public RsaSecurityKey GetKey()
        public SigningCredentials GetKey()
        {
            if (NeedsUpdate()) GenerateKeyAndSave();
            var rsa = RSA.Create(); // new System.Security.Cryptography.RSACryptoServiceProvider();
            rsa.ImportParameters(GetKeyParameters());
            var signingCredentials = new SigningCredentials(new RsaSecurityKey(rsa), SecurityAlgorithms.RsaSha256)
            {
                CryptoProviderFactory = new CryptoProviderFactory { CacheSignatureProviders = false }
            };
            return signingCredentials;
            //return new RsaSecurityKey(provider);
        }


        /// <summary>
        /// Util class to allow restoring RSA parameters from JSON as the normal
        /// RSA parameters class won't restore private key info.
        /// </summary>
        private class RSAParametersWithPrivate
        {
            public byte[] D { get; set; }
            public byte[] DP { get; set; }
            public byte[] DQ { get; set; }
            public byte[] Exponent { get; set; }
            public byte[] InverseQ { get; set; }
            public byte[] Modulus { get; set; }
            public byte[] P { get; set; }
            public byte[] Q { get; set; }

            public void SetParameters(RSAParameters p)
            {
                D = p.D;
                DP = p.DP;
                DQ = p.DQ;
                Exponent = p.Exponent;
                InverseQ = p.InverseQ;
                Modulus = p.Modulus;
                P = p.P;
                Q = p.Q;
            }
            public RSAParameters ToRSAParameters()
            {
                return new RSAParameters()
                {
                    D = this.D,
                    DP = this.DP,
                    DQ = this.DQ,
                    Exponent = this.Exponent,
                    InverseQ = this.InverseQ,
                    Modulus = this.Modulus,
                    P = this.P,
                    Q = this.Q

                };
            }
        }
    }
}
