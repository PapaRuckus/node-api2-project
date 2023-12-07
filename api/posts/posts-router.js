const express = require("express");
const Post = require("./posts-model");

const router = express.Router();

router.get("/", (req, res) => {
  Post.find()
    .then((found) => {
      res.json(found);
    })
    .catch((err) => {
      res.status(500).json({
        message: "The posts information could not be retrieved",
      });
    });
});

router.get("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      res.status(404).json({
        message: "The post with the specified ID does not exist",
      });
    } else {
      res.json(post);
    }
  } catch (err) {
    res.status(500).json({
      message: "The post information could not be retrieved",
    });
  }
});

router.post("/", (req, res) => {
  const { title, contents } = req.body;
  if (!title || !contents) {
    res.status(400).json({
      message: "Please provide title and contents for the post",
    });
  } else {
    Post.insert({ title, contents })
      .then(({ id }) => {
        return Post.findById(id);
      })
      .then((post) => {
        res.status(201).json(post);
      })
      .catch((err) => {
        res.status(500).json({
          message: "There was an error while saving the post to the database",
        });
      });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      res.status(404).json({
        message: "The post with the specified ID does not exist",
      });
    } else {
      await Post.remove(req.params.id);
      res.json(post);
    }
  } catch (err) {
    res.status(500).json({
      message: "The post could not be removed",
    });
  }
});

// router.put("/:id", (req, res) => {
//   const { title, contents } = req.body;
//   if (!title || !contents) {
//     res.status(400).json({
//       message: "Please provide title and contents for the post",
//     });
//   } else {
//     Post.findById(req.params.id)
//       .then((updatedPost) => {
//         if (!updatedPost) {
//           res.status(404).json({
//             message: "The post with the specified ID does not exist",
//           });
//         } else {
//           return Post.update(req.params.id, req.body);
//         }
//       })
//       .then((data) => {
//         if (data) {
//           return Post.findById(req.params.id);
//         }
//       })
//       .then((post) => {
//         if (post) {
//           res.json(post);
//         }
//       })
//       .catch((err) => {
//         res.status(500).json({
//           message: "The post information could not be modified",
//         });
//       });
//   }
// });
router.put("/:id", async (req, res) => {
  try {
    const { title, contents } = req.body;
    if (!title || !contents) {
      return res.status(400).json({
        message: "Please provide title and contents for the post",
      });
    }

    const updatedPost = await Post.findById(req.params.id);

    if (!updatedPost) {
      return res.status(404).json({
        message: "The post with the specified ID does not exist",
      });
    }

    await Post.update(req.params.id, req.body);
    const post = await Post.findById(req.params.id);

    if (post) {
      return res.json(post);
    }
  } catch (err) {
    return res.status(500).json({
      message: "The post information could not be modified",
    });
  }
});

router.get("/:id/messages", (req, res) => {});

module.exports = router;
