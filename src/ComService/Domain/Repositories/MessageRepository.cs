using ComService.Infrastructure;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace ComService.Domain.Repositories
{
    public interface IMessageRepository
    {
        //get message history
        IQueryable<Message> Messages { get; }

        void Add(Message message);

        Task SaveChangesAsync();
    }
    public class MessageRepository : IMessageRepository
    {
        private readonly ComDbContext _dbContext;
        public MessageRepository(ComDbContext comDbContext)
        {
            _dbContext = comDbContext;
        }

        public IQueryable<Message> Messages =>
             _dbContext.Messages.AsQueryable()
                .Include(o=>o.UserSender)
                .Include(o=>o.Files)
                //event
                .Include(o=>o.Event)
                    .ThenInclude(o=>o.EventType);

        public void Add(Message message)
        {
            _dbContext.Messages.Add(message);
        }

        public Task SaveChangesAsync()
        {
            return _dbContext.SaveChangesAsync();
        }

    }
}
