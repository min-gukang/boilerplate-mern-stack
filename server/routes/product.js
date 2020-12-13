const express = require('express');
const router = express.Router();
const multer = require('multer');
const { Product } = require('../models/Product')


//=================================
//             Product
//=================================
//multer 사용
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/') //파일을 어디에다 저장해 둘건지 root에서 폴더를 만들어 거기에 저장함. 
    }, 
    filename: function (req, file, cb) {
      cb(null, `${Date.now()}_${file.originalname}`) //파일이름 설정 
    }
  })
   
  var upload = multer({ storage: storage }).single("file")

router.post('/image', (req, res) => {
    
    //가져온 이미지를 저장해준다.
    upload(req, res, err => {
        if(err) { //파일저장을 실패하면
            return res.json({success : false, err})
        }   
        //파일저장 성공시, 파일경로와 파일이름을 전송한다. 프론트엔드로 전달!!
        return res.json({success : true, filePath: res.req.file.path  , fileName : res.req.file.filename})
    })
})

//onSubmit할시 서버에서 처리하는 과정. upload페이지에서 여러 정보를 입력한 후, 제출하면 서버에서 db에 저장한다. 
router.post('/', (req, res) => {

  //받아온 정보들을 db에 넣어준다. 
  //우선 Product model을 가져온다. 
  const product = Product(req.body) //req.body안에 폼데이터에서 입력한 정보들이 모두 들어가잇음.
  
  product.save((err) => {
    if(err) return res.status(400).json({success : false, err})
    return res.status(200).json({success : true})
  })

})

//landing page에서 보낸 Post요청 처리
router.post('/products', (req, res) => {

  let limit = req.body.limit ? parseInt(req.body.limit) : 20;
  let skip = req.body.skip ? parseInt(req.body.skip) : 0;

  //checkbox filter 부분 처리해야 한다. 필터할 정보들이 포함되어 있음. 이걸 db에서 쓰면된다. 
  let findArgs = {};

  for(let key in req.body.filters) { //filters ={ "continents" : [], "price" : []}
    if(req.body.filters[key].length > 0) {
      
      if(key === 'price') {
        findArgs[key] = {
          $gte : req.body.filters[key][0],
          $lte : req.body.filters[key][1]
        }
      } else {
        findArgs[key] = req.body.filters[key];
      }
    }
  }

  console.log(findArgs); //findArgs = {"continents" : [], "price" : []}


  // product collection(db)에 있는 모든 상품들을 가져오기
  Product.find(findArgs) //Product collection안에 있는 모든 정보를 찾는것. => filter된거 적용함. 
    .populate("writer") //writer에 대한 모든 정보를 가져올 수 있다. 
    .skip(skip)
    .limit(limit)
    .exec((err, productInfo) => { //쿼리를 돌린다?? //productInfo는 db에서 가져온 정보들 
        if(err) return res.status(400).json({success:false, err})
        return res.status(200).json({
          success:true, productInfo,
          postSize : productInfo.length
        })
    }) 
})




module.exports = router;
