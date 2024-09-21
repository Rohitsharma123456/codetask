const express = require('express');
const { db } = require('../db/db'); // Adjust the path as needed
const router = express.Router();

// CREATE a new recommendation

router.get("/create",(req,res)=>{
    return res.render("createrecommendation")
})
router.post('/', async (req, res) => {
    const { title, caption, category } = req.body;
    const user_id=req.session.userId
    try {
        const newRecommendation = await db.Recommendation.create({
            user_id,
            title,
            caption,
            category,
        });
        res.redirect("/recommndations")
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to create recommendation.' });
    }
});

// READ all recommendations for a specific user
router.get('/:userId', async (req, res) => {
    const userId = req.params.userId;

    try {
        const recommendations = await db.Recommendation.findAll({ where: { user_id: userId } });
        res.status(200).json(recommendations);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to retrieve recommendations.' });
    }
});
router.get('/', async (req, res) => {
    const userId = req.params.userId;

    try {
        const messages = {
            error: req.flash('error'),
            // Add other message types if necessary
        };
        const recommendations = await db.Recommendation.findAll({ });
        res.render("listrecommandations",{
            recommendations,
            messages
        })
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to retrieve recommendations.' });
    }
});
// UPDATE a recommendation
router.put('/:id', async (req, res) => {
    const recommendationId = req.params.id;
    const { title, caption, category } = req.body;

    try {
        const [updated] = await db.Recommendation.update(
            { title, caption, category },
            { where: { id: recommendationId } }
        );

        if (updated) {
            const updatedRecommendation = await db.Recommendation.findByPk(recommendationId);
            res.status(200).json(updatedRecommendation);
        } else {
            res.status(404).json({ message: 'Recommendation not found.' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to update recommendation.' });
    }
});

// DELETE a recommendation
router.get('/deleterecommandation/:id', async (req, res) => {
    const recommendationId = req.params.id;

    try {
        const Recommendation = await db.Recommendation.findOne({ where: { id: recommendationId } });
        const loggedinuserid=req.session.userId
        
        if (loggedinuserid != Recommendation.user_id) {
            req.flash('error', 'You do not have permission to perform this action.');
            return res.redirect(`/recommndations`);
        }
        await Recommendation.destroy()
        res.redirect("/recommndations")
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to delete recommendation.' });
    }
});


router.get("/collection/create",(req,res)=>{
    return res.render("createcollection")
})

router.post('/collection', async (req, res) => {
    const { title } = req.body;
    const user_id=req.session.userId
    try {
        const newRecommendation = await db.Collection.create({
            user_id,
            title,
          
        });
        res.redirect("/recommndations/collection/list")
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to create recommendation.' });
    }
});

router.get('/collection/list', async (req, res) => {
    const userId = req.params.userId;

    try {
        const collections = await db.Collection.findAll({ });
        res.render("listcollection",{
            collections
        })
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to retrieve recommendations.' });
    }
});

router.get('/collection/deleterecommadation/:id', async (req, res) => {
    const id = req.params.id;

    try {
    
        const collections = await db.Collection.findOne({where:{
            id:id
        } });
        
        const loggedinuserid=req.session.userId
        if (loggedinuserid != collections?.user_id) {
                  req.flash('error', 'You do not have permission to perform this action.');
                  return res.redirect(`/recommndations`);
              }
        await collections.destroy()
        res.redirect("/recommndations/collection/list")
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to retrieve recommendations.' });
    }
});

router.get('/collection/addtocollection/:id', async (req, res) => {
    

    try {
        const recommendationid=req.params.id
        const collections = await db.Collection.findAll({ });
        res.render("addtocollection",{
            collections,
            recommendationid
        })
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to retrieve recommendations.' });
    }
});


router.get('/collection/addtocollection/:collection_id/:recommendation_id', async (req, res) => {
    

    try {
        const {collection_id,recommendation_id}=req.params
        const loggedinuserid=req.session.userId
        const recommendationuserid=(await db.Recommendation.findByPk(recommendation_id))?.user_id
        if (loggedinuserid != recommendationuserid) {
            req.flash('error', 'You do not have permission to perform this action.');
            return res.redirect(`/recommndations/collection/view/${collection_id}`);
        }
        const Collection_recommendation = await db.Collection_recommendation.create({
            collection_id:collection_id,
            recommendation_id:recommendation_id
         });
         const collections = await db.Collection.findAll({ });
         res.redirect(`/recommndations/collection/view/${collection_id}`);

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to retrieve recommendations.' });
    }
});


router.get('/collection/view/:id', async (req, res) => {
    

    try {
        const {id}=req.params
       
         const collection = await db.Collection.findOne({where:{id:id},include:[
            {model:db.Collection_recommendation,
            include:[
                db.Recommendation
            ]}
         ] });
         const messages = {
            error: req.flash('error'),
            // Add other message types if necessary
        };
        //  return res.json(collections)
        res.render("viewcollection",{
            collection,
            messages
        })
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to retrieve recommendations.' });
    }
});

router.get('/collection/deleterecommendation/:id/:coll_id', async (req, res) => {
    

    try {
        const {id,coll_id}=req.params
        
         const collection = await db.Collection_recommendation.destroy({where:{id:id}});

        //  return res.json(collections)
        res.redirect(`/recommndations/collection/view/${coll_id}`)
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to retrieve recommendations.' });
    }
});
module.exports = router;
