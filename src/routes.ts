import { Express, Request, Response } from "express";
import {
  createUserHandler,
  getUsersHandler,
} from "./controller/user.controller";
import {
  createUserSessionHandler,
  getUserSessionsHandler,
  invalidateUserSessionHandler,
} from "./controller/session.controller";
import { validateRequest, requiresUser } from "./middleware";
import {
  createUserSchema,
  createUserSessionSchema,
} from "./schema/user.schema";
import {
  createPostSchema,
  deletePostSchema,
  updatePostSchema,
} from "./schema/post.schema";
import {
  createPostHandler,
  deletePostHandler,
  getPostHandler,
  getPostsHandler,
  updatePostHandler,
} from "./controller/post.controller";

export default function (app: Express) {
  app.get("/test", (req: Request, res: Response) => res.send("test"));

  app.get("/api/users", getUsersHandler);
  // Register user POST /api/users
  app.post("/api/users", validateRequest(createUserSchema), createUserHandler);

  // Login POST /api/ sessions
  app.post(
    "/api/sessions",
    validateRequest(createUserSessionSchema),
    createUserSessionHandler
  );
  // Get the users sessions GET /api/sessions
  app.get("/api/sessions", requiresUser, getUserSessionsHandler);

  // Logout DELETE /api/sessions
  app.delete("/api/sessions", requiresUser, invalidateUserSessionHandler);

  // Create a post
  app.post(
    "/api/posts",
    [requiresUser, validateRequest(createPostSchema)],
    createPostHandler
  );

  // Update a post
  app.put(
    "/api/posts/:postId",
    [requiresUser, validateRequest(updatePostSchema)],
    updatePostHandler
  );

  // Get a post
  app.get("/api/posts/:postId", getPostHandler);

  // Get all posts
  app.get("/api/posts", getPostsHandler);

  // Delete a post
  app.delete(
    "/api/posts/:postId",
    [requiresUser, validateRequest(deletePostSchema)],
    deletePostHandler
  );
}
