using ComService.Infrastructure;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace ComService.Domain.Repositories
{
    public interface IChannelRepository
    {
        IQueryable<Channel> Channels { get; }

        Task<Channel> Get(string id);
        void Add(Channel channel);
        void Update(Channel channel);
        void Delete(Channel channel);

        Task SaveChangesAsync();
    }

    public class ChannelRepository : IChannelRepository
    {
        private readonly ComDbContext _dbContext;
        public ChannelRepository(ComDbContext comDbContext)
        {
            _dbContext = comDbContext;
        }
        public IQueryable<Channel> Channels => _dbContext.Channels
                .Include(o=>o.RecentEvents
                         .OrderByDescending(x => x.Event.CreatedDate)
                        .Take(20))
                    .ThenInclude(o => o.Event.UserSender)

                .Include(o => o.AllowedEventTypes)
                    .ThenInclude(o => o.EventType)

                .Include(o => o.RecentEvents)
                    .ThenInclude(o=>o.Event)
                        .ThenInclude(o => o.Files)

                .Include(o => o.RecentEvents)
                    .ThenInclude(o => o.Event)
                        .ThenInclude(o => o.EventType)

                .Include(o => o.Members)
                    .ThenInclude(o => o.UserMember)
                
                .Include(o => o.RecentMessages
                        .OrderByDescending(x => x.SentDate)
                        .Take(20))
                    .ThenInclude(o => o.Files)
                .Include(o => o.RecentMessages)
                    .ThenInclude(o => o.UserSender)

                .Include(o => o.RecentMessages)
                    .ThenInclude(o => o.Event)

                .AsQueryable();

        public void Add(Channel channel)
        {
            _dbContext.Channels.Add(channel);
        }
        public void Update(Channel channel)
        {
            _dbContext.Channels.Update(channel);
        }

        public void Delete(Channel channel)
        {
            _dbContext.Channels.Remove(channel);
        }

        public Task<Channel> Get(string id)
        {
            return this.Channels.FirstOrDefaultAsync(o => o.Id == id);
        }

        public Task SaveChangesAsync()
        {
            return _dbContext.SaveChangesAsync();
        }

       
    }
}
