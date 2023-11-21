
const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const sharp = require('sharp');

const app = express();
const PORT = process.env.PORT || 3000;

// MongoDB Connection
mongoose.connect('mongodb://localhost/imageGallery', { useNewUrlParser: true, useUnifiedTopology: true });

// Define MongoDB Schema and Model for User and Image
const userSchema = new mongoose.Schema({
  email: String,
  googleId: String,
});

const imageSchema = new mongoose.Schema({
  filename: String,
  path: String,
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
});

const User = mongoose.model('User', userSchema);
const Image = mongoose.model('Image', imageSchema);

// Multer configuration for image upload
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.post('/upload', upload.single('image'), async (req, res) => {
  try {
    const { buffer, originalname } = req.file;
    const user = await User.findOne({ googleId: req.body.googleId });

    // Resize and convert to webp format using Sharp
    const processedImage = await sharp(buffer)
      .resize({ width: 300 })
      .webp()
      .toBuffer();

    const newImage = new Image({
      filename: originalname,
      path: `uploads/${originalname}`,
      user: user._id,
    });

    await newImage.save();
    res.status(201).send('Image uploaded successfully.');
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});


// Middleware for CORS
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
  });
  
  

app.get('/images/:userId', async (req, res) => {
  try {
    const images = await Image.find({ user: req.params.userId });
    res.json(images);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
