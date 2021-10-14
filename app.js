const Telegraf = require("telegraf").Telegraf;
const env = require("dotenv");
const mongoose = require("mongoose");
const User = require("./userModel");
env.config();

mongoose.connect(process.env.MONGO_DB_URI, {
  useNewUrlParser: true,
  // useUnifiedTopology: true,
  // useFindAndModify: false,
});
mongoose.connection
  .once("open", function () {
    console.log("Connected to Mongo");
  })
  .on("error", function (err) {
    console.log("Mongo Error", err);
  });

const bot = new Telegraf(process.env.API_KEY);

bot.command("start", (ctx) => {
  console.log(ctx.from);
  bot.telegram.sendMessage(
    ctx.chat.id,
    "hello there! Welcome to my new Covid-19-Access bot.",
    {}
  );
});

//method that displays the inline keyboard buttons

bot.hears("hello", async (ctx) => {
  console.log(ctx.from);
  const user = new User({ userId: ctx.from.id, name: ctx.from.first_name });

  const createdUser = await user.save();

  let userMessage = `How many vaccines shots have been administered to you? 1. Not vaccinated, 2. One, 3. Two`;
  let userMessage1 = `Please Enter your Age Slot? a. If Age less than 18 b. If Age is in between 18-45 c. If Age is above 45`;
  ctx.deleteMessage();
  bot.telegram.sendMessage(ctx.chat.id, userMessage, {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: "1",
            callback_data: "Not Vaccinated",
          },
          {
            text: "2",
            callback_data: "One",
          },
          {
            text: "3",
            callback_data: "Two",
          },
        ],
      ],
    },
  });

  bot.telegram.sendMessage(ctx.chat.id, userMessage1, {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: "a",
            callback_data: "If Age less than 18",
          },
          {
            text: "b",
            callback_data: "If Age is in between 18-45",
          },
          {
            text: "c",
            callback_data: "If Age is above 45",
          },
        ],
      ],
    },
  });
});

bot.action("Not Vaccinated", async (ctx) => {
  const addUser = await User.findOneAndUpdate(
    { userId: ctx.from.id },
    { $set: { vaccinated: "Not Vaccinated" } },
    { new: true, upsert: true, useFindAndModify: false }
  );
});

bot.action("One", async (ctx) => {
  const addUser = await User.findOneAndUpdate(
    { userId: ctx.from.id },
    { $set: { vaccinated: "One" } },
    { new: true, upsert: true, useFindAndModify: false }
  );
});

bot.action("Two", async (ctx) => {
  const addUser = await User.findOneAndUpdate(
    { userId: ctx.from.id },
    { $set: { vaccinated: "Two" } },
    { new: true, upsert: true, useFindAndModify: false }
  );
});

bot.action("If Age less than 18", async (ctx) => {
  const addUser = await User.findOneAndUpdate(
    { userId: ctx.from.id },
    { $set: { age: "If Age less than 18" } },
    { new: true, upsert: true, useFindAndModify: false }
  );
});

bot.action("If Age is in between 18-45", async (ctx) => {
  const addUser = await User.findOneAndUpdate(
    { userId: ctx.from.id },
    { $set: { age: "If Age is in between 18-45" } },
    { new: true, upsert: true, useFindAndModify: false }
  );
});

bot.action("If Age is above 45", async (ctx) => {
  const addUser = await User.findOneAndUpdate(
    { userId: ctx.from.id },
    { $set: { age: "If Age is above 45" } },
    { new: true, upsert: true, useFindAndModify: false }
  );
});

bot.hears("phone", (ctx, next) => {
  console.log(ctx.from);
  bot.telegram.sendMessage(
    ctx.chat.id,
    "Can we get access to your phone number?",
    requestPhoneKeyboard
  );
});

//method for requesting user's location

bot.hears("location", (ctx) => {
  console.log(ctx.from);
  bot.telegram.sendMessage(
    ctx.chat.id,
    "Can we access your location?",
    requestLocationKeyboard
  );
});

const requestPhoneKeyboard = {
  reply_markup: {
    one_time_keyboard: true,
    keyboard: [
      [
        {
          text: "My phone number",
          request_contact: true,
          one_time_keyboard: true,
        },
      ],
      ["Cancel"],
    ],
  },
};

const requestLocationKeyboard = {
  reply_markup: {
    one_time_keyboard: true,
    keyboard: [
      [
        {
          text: "My location",
          request_location: true,
          one_time_keyboard: true,
        },
      ],
      ["Cancel"],
    ],
  },
};

bot.on("restart", (ctx) => {
  const user = await User.find({ userId: ctx.from.id });
  await user.remove();
  ctx.telegram.sendMessage(
    ctx.chat.id,
    `hello there! Welcome to my new Covid-19-Access bot.`
  );

  ctx.reply(`hello there! Welcome to my new Covid-19-Access bot.`);
});

bot.launch();
