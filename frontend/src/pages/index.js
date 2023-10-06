import { useEffect, useState } from 'react';
import { Progress, Rate, Radio, Slider, Input, Typography, Button, Breadcrumb, notification, List, Divider, Avatar, Spin } from 'antd'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlassChart } from "@fortawesome/free-solid-svg-icons";

const { Title } = Typography;

const URL = "http://localhost:5000"

export default function Home() {

  const [data, setData] = useState(null);
  const [productId, setProductId] = useState(null);
  const [productData, setProductData] = useState(null);
  const [reviewMode, setReviewMode] = useState(false);
  const [reviewText, setReviewText] = useState("");

  const getProducts = () => {
          fetch(URL + "/products/" + productId)
                    .then(data => {
                        return data.json()
                    })
                    .then(data => {
                        setProductData(data)
                    })
  }

  useEffect(()=> {
    if (productId !== null) {
      getProducts()
    }

  }, productId)

  useEffect(() => {

    fetch(URL + "/products")
        .then(data => {
            return data.json()
        })
        .then(data => {
            setData(data)
        })

//    setData([
//      {
//        "category": "Appliances",
//        "products": [
//          { "product_id": "1", "summary": "blah blah" },
//          { "product_id": "2", "summary": "blah blah" }
//        ]
//      }
//    ])

//    setProductData({
//      product_id: 1,
//      summary: 'Okay machine',
//      reviews: [
//        {
//          review_id: '1',
//          reviewer_name: 'Anand Joshi',
//          review_text: 'What a washing machine aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
//          sentiment: 'Good'
//        },
//        {
//          review_id: '2',
//          reviewer_name: 'Ramesh',
//          review_text: 'What a washing machine',
//          sentiment: 'Bad'
//        },
//        {
//          review_id: '3',
//          reviewer_name: 'Ramesh',
//          review_text: 'What a washing machine',
//          sentiment: 'Neutral'
//        },
//        {
//          review_id: '1',
//          reviewer_name: 'Anand Joshi',
//          review_text: 'What a washing machine aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
//          sentiment: 'Good'
//        },
//        {
//          review_id: '2',
//          reviewer_name: 'Ramesh',
//          review_text: 'What a washing machine',
//          sentiment: 'Bad'
//        },
//        {
//          review_id: '3',
//          reviewer_name: 'Ramesh',
//          review_text: 'What a washing machine',
//          sentiment: 'Neutral'
//        },
//        {
//          review_id: '3',
//          reviewer_name: 'Ramesh',
//          review_text: 'What a washing machine',
//          sentiment: 'Neutral'
//        },
//        {
//          review_id: '1',
//          reviewer_name: 'Anand Joshi',
//          review_text: 'What a washing machine aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
//          sentiment: 'Good'
//        },
//        {
//          review_id: '2',
//          reviewer_name: 'Ramesh',
//          review_text: 'What a washing machine',
//          sentiment: 'Bad'
//        },
//        {
//          review_id: '3',
//          reviewer_name: 'Ramesh',
//          review_text: 'What a washing machine',
//          sentiment: 'Neutral'
//        },
//
//
//
//      ]
//    })

  }, [])

  const addReview = () => {
      var myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");


      var raw = JSON.stringify({
        "product_id": "A37DQO5LU8DXTV",
        "reviewer_name": "Anand Joshi",
        "review_text": "What a washing machine"
      });

      var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: JSON.stringify({
            "product_id":productId,
            "reviewer_name":'Anonymous',
            "review_text": reviewText
        }),
        redirect: 'follow'
      };

      fetch("http://localhost:5000/add_review", requestOptions)
        .then(response => {
            if(response.status==200){
                openNotification();
                setReviewText("");
                setReviewMode(false);
                getProducts();
            }
        })
        .then(result => console.log(result))
        .catch(error => console.log('error', error));
      }

      const openNotification = () => {
        notification.open({
          message: 'Review Added',
          description:
            'Your review for product'+productId+' has been added',
          onClick: () => {
            console.log('Submitted!');
          },
        });
  };

  return (
    <div>
      <div className='m-10'>
        <Title>
        <FontAwesomeIcon size='xs' className='mr-4 ml-2' icon={faMagnifyingGlassChart}/>
          Amazon Review Analyzer
        </Title>
      </div>
      <div className='m-10 grid grid-flow-col gap-3'>
        <div className='m-5 col-span-1 min-h-full' >
          {data !== null && data.map((item, index) => {
            return (
              <>
                <Divider orientation="left">{item.category}</Divider>
                <List
                  size="small"
                  bordered
                  // itemLayout="vertical"
                  dataSource={item.products}
                  renderItem={(item, index) => (
                    <List.Item onClick={() => {
                      setProductId(item.product_id);
                      setProductData(null);
//                      let data_copy = JSON.parse(JSON.stringify(data))
//
//                      setData(null);
//                      setTimeout(()=> {
//                        setData(data_copy)
//                      }, 500)

                    }}
                    style={(item.product_id == productId? {backgroundColor: '#3B01E1'}: {})}
                    >
                      <List.Item.Meta
                        title={"Product " + item.product_id }
                        description={item.summary}
                      />
                    </List.Item>
                  )}
                />
              </>
            )
          })}
        </div>

        {productId !== null &&
        <div className='m-5 col-span-4 min-h-full'>
          <Divider orientation="left">Reviews</Divider>
          <List
            className='add-review'
            size="medium"
            bordered
            style={{marginBottom: '12px'}}
            // itemLayout="vertical"
            dataSource={[{}]}
            renderItem={(item, index) => (
              <List.Item>
                {!reviewMode ?
                  <div onClick={()=> {
                    setReviewMode(true);
                  }}>+ Add Review</div>
                  :
                  <>
                    <textarea style={{backgroundColor: 'black'}} value={reviewText} onChange={e => setReviewText(e.target.value)} className='w-full m-2 rounded-sm' placeholder='Enter your review'></textarea>
                    <div className='flex flex-col'>
                      <Button className='rounded-lg mb-1' type="dashed" onClick={() => setReviewMode(false)}>
                        Cancel 
                      </Button>
                      <Button className='rounded-lg' type="default" loading={false} onClick={() => addReview()}>
                        Submit
                      </Button>
                    </div>
                  </>
                }
              </List.Item>
            )}
          />
          {productData !== null ? (
          <>
                        <List
                          size="medium"
                          bordered
                          // itemLayout="vertical"
                          dataSource={productData.reviews}
                          renderItem={(item, index) => (
                            <List.Item
                              // style={item.sentiment === 'Good' ? { backgroundColor: '#1E5128' } : item.sentiment === 'Neutral' ? { backgroundColor: '#0F044C' } : { backgroundColor: '#44000D' }}
                            >
                              <List.Item.Meta
                                title={item.review_text}
                                description={item.reviewer_name}
                                avatar={
                                  <Avatar style={
                                    item.sentiment === 'Positive' ? { backgroundColor: 'lightgreen', verticalAlign: 'middle', color: '#000'} : item.sentiment === 'Neutral' ? { backgroundColor: 'lightskyblue', verticalAlign: 'middle', color: '#000' } : { backgroundColor: 'lightsalmon', verticalAlign: 'middle', color: '#000'}}>
                                    {item.reviewer_name.split(" ").map(str => str[0]).join("")}
                                  </Avatar>
                                }
                              />
                              <div className='p-1 rounded'
                              // style={item.sentiment === 'Good' ? { backgroundColor: 'lightgreen', color: '#000'} : item.sentiment === 'Neutral' ? { backgroundColor: 'lightskyblue',  color: '#000' } : { backgroundColor: 'lightsalmon', color: '#000'}}
                              >{item.sentiment}</div>
                            </List.Item>
                          )}
                        />
                      </>
          ) : (
          <>
          <div className="mt-10 w-full h-auto flex flex-wrap justify-center">
            <Spin tip="loading" size="large"/ >
          </div>
          </>
          )

          }



        </div>}
      </div>
    </div >
  )
}
