exports.noRoute = (req,res,next) => {
    res.status(400).json({
        message:"No Route Found",
        error:"No Route Found"
    })
}