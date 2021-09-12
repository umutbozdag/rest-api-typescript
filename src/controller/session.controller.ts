import { validatePassword } from "../service/user.service";
import { Request, Response } from "express";
import {
  createAccessToken,
  createSession,
  findSessions,
  updateSession,
} from "../service/session.service";
import config from "config";
import { sign } from "../utils/jwt.utils";
import { get } from "lodash";

export async function createUserSessionHandler(req: Request, res: Response) {
  try {
    // validate the email and pass
    const user = await validatePassword(req.body);

    if (!user) {
      return res.status(401).send("Invalid username or password");
    }
    // create a session

    const session = await createSession(user._id, req.get("user-agent") || "");
    // create access token
    const accessTokken = createAccessToken({
      user,
      session,
    });

    const refreshToken = sign(session, {
      expiresIn: config.get("refreshTokenTtl"),
    });
    // create refresh token
    // send access and refresh token

    return res.send({ accessTokken, refreshToken });
  } catch (error) {}
}

export async function invalidateUserSessionHandler(
  req: Request,
  res: Response
) {
  const sessionId = get(req, "user.session");

  await updateSession({ _id: sessionId }, { valid: false });

  return res.sendStatus(200);
}

export async function getUserSessionsHandler(req: Request, res: Response) {
  const userId = get(req, "user._id");

  const sessions = await findSessions({ user: userId, valid: true });

  return res.send(sessions);
}
