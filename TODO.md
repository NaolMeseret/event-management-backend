# Event Management Backend Implementation TODO

## Current Progress: 0/12

### Phase 1: Core Setup (Steps 1-3)
- [x] 1. Import EventsModule into AppModule.ts
- [x] 2. Complete CreateEventDto with nested steps/amenities/images
- [x] 3. Configure Multer properly in EventsModule (diskStorage, limits, image validation)

### Phase 2: Events Full CRUD (Steps 4-6)
- [ ] 4. Update EventsService create() to handle nested data transactionally
- [ ] 5. Add endpoints for steps/amenities/featured-image management
- [ ] 6. Enhance findAll/findOne with proper includes and aggregations

### Phase 3: Categories (Steps 7-8)
- [ ] 7. Create categories.module.ts, controller, service, DTOs
- [ ] 8. Implement categories CRUD endpoints

### Phase 4: Interactions (Steps 9-10)
- [ ] 9. Create interactions module/endpoints for likes/bookmarks/comments/ratings
- [ ] 10. Implement toggle logic (like/unlike) with guards

### Phase 5: Advanced DB & Polish (Steps 11-12)
- [ ] 11. Add PostgreSQL triggers/functions for avgRating/totalLikes (via migration)
- [ ] 12. Prisma migrate dev, test all endpoints, static uploads

**Next Action**: Start Phase 1 Step 1
**Run**: `npm run start:dev` after each phase to test.
