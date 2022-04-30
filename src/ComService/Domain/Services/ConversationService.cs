using NextOne.Shared.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ComService.Domain.Services
{
    public interface IConversationService
    {
        Task<IEnumerable<Conversation>> GetConversationsByUser(PageOptions pageOptions);
        Task<Conversation> Get(string id);
        Task Add(Conversation conversation);
        Task Delete(Conversation conversation);

        //message
        Task AddMessage(Conversation conversation, Message message);
        Task<Message> GetMessageById(string messageId);
        Task<IEnumerable<Message>> GetOldMessages(DateTime beforeDate, PageOptions pageOptions);
        Task<IEnumerable<Message>> GetMessagesNearBy(string messageId);

        //members
        Task AddMember(Conversation conversation, UserStatus user, MemberRoleEnum role);
        Task UpdateMemberRole(Conversation conversation, UserStatus user, MemberRoleEnum role);
        Task DeleteMember(Conversation conversation, UserStatus user);
    }
}
