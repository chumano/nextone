using ComService.Infrastructure;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ComService.Domain.Repositories
{
    public interface IEventRepository
    {
        //get message history
        IQueryable<Event> Events { get; }

        void Add(Event evt);

        Task SaveChangesAsync();
    }
    public class EventRepository : IEventRepository
    {
        private readonly ComDbContext _dbContext;
        public EventRepository(ComDbContext comDbContext)
        {
            _dbContext = comDbContext;
        }

        public IQueryable<Event> Events =>
             _dbContext.Events.AsQueryable()
                .Include(o => o.UserSender)
                .Include(o => o.Files);

        public void Add(Event evt)
        {
            _dbContext.Events.Add(evt);
        }

        public Task SaveChangesAsync()
        {
            return _dbContext.SaveChangesAsync();
        }

    }
}
