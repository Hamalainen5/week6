const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const api = supertest(app);
const User = require("../models/userModel");
const Workout = require("../models/workoutModel");
const workouts = require("./data/workouts.js");

let token = null;

beforeAll(async () => {
  await User.deleteMany({});
  const result = await api
    .post("/api/user/signup")
    .send({ email: "mattiv@matti.fi", password: "R3g5T7#gh" });
  token = result.body.token;
});

describe("when there is initially some workouts saved", () => {
  let workoutId = null; 

  beforeEach(async () => {
    await Workout.deleteMany({});

    // Create one workout and save its ID
    const response = await api
      .post("/api/workouts")
      .set("Authorization", "bearer " + token)
      .send(workouts[0]);
      console.log("Workout created:", workoutId);


    workoutId = response.body._id;
  });

  it("Workouts are returned as json", async () => {
    await api
      .get("/api/workouts")
      .set("Authorization", "bearer " + token)
      .expect(200)
      .expect("Content-Type", /application\/json/);
  });

  it("New workout added successfully", async () => {
    const newWorkout = { title: "testworkout", reps: 10, load: 100 };
    await api
      .post("/api/workouts")
      .set("Authorization", "bearer " + token)
      .send(newWorkout)
      .expect(201);
  });

  it("can fetch a single workout by ID", async () => {
    const response = await api
      .get(`/api/workouts/${workoutId}`)
      .set("Authorization", "bearer " + token)
      .expect(200)
      .expect("Content-Type", /application\/json/);

    expect(response.body._id).toBe(workoutId);
    expect(response.body.title).toBe(workouts[0].title);
  });

  it("can update a workout", async () => {
    const updatedWorkout = { title: "Updated Workout", reps: 15, load: 120 };

    const response = await api
      .put(`/api/workouts/${workoutId}`)
      .set("Authorization", "bearer " + token)
      .send(updatedWorkout)
      .expect(200);

    expect(response.body.title).toBe(updatedWorkout.title);
    expect(response.body.reps).toBe(updatedWorkout.reps);
    expect(response.body.load).toBe(updatedWorkout.load);
  });

  it("can delete a workout", async () => {
    await api
      .delete(`/api/workouts/${workoutId}`)
      .set("Authorization", "bearer " + token)
      .expect(200);

    await api
      .get(`/api/workouts/${workoutId}`)
      .set("Authorization", "bearer " + token)
      .expect(404);
  });
});
