using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MasterService.DTOs.User
{
    public class GetUserListDTO
    {
        public bool ExcludeMe { get; set; }
        public string TextSearch {  get; set; }
        public int Offset { get; set; }
        public int PageSize { get; set; }
    }
}
