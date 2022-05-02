using ComService.Infrastructure;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ComService.Domain.Repositories
{
    public interface IConversationRepository
    {
        IQueryable<Conversation> Conversations { get; }

        Task<Conversation> Get(string id);
        void Add(Conversation conversation);
        void Update(Conversation conversation);
        void Delete(Conversation conversation);

        Task SaveChangesAsync();
    }

    public class ConversationRepository : IConversationRepository
    {
        private readonly ComDbContext _dbContext;
        public ConversationRepository(ComDbContext comDbContext)
        {
            _dbContext = comDbContext;
        }

        public IQueryable<Conversation> Conversations =>
            _dbContext.Conversations
                .Include(o => o.Members)
                    .ThenInclude(o => o.UserMember)
                .Include(o => o.RecentMessages
                        .OrderByDescending(x => x.SentDate)
                        .Take(20))
                    .ThenInclude(o => o.Files)
                .Include(o => o.RecentMessages)
                    .ThenInclude(o => o.UserSender)
                .AsQueryable();

        public async Task<Conversation> Get(string id)
        {
            return await this.Conversations.FirstOrDefaultAsync(o => o.Id == id);
        }

        public void Add(Conversation conversation)
        {
            _dbContext.Conversations.Add(conversation);
        }

        public void Update(Conversation conversation)
        {
            _dbContext.Conversations.Update(conversation);
        }

        public void Delete(Conversation conversation)
        {
            _dbContext.Conversations.Remove(conversation);
        }

  
        public Task SaveChangesAsync()
        {
            return _dbContext.SaveChangesAsync();
        }

      
    }
}
