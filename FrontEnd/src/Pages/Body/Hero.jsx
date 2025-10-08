
{/* 
      <div className="p-2 w-full">
        <h1 className="text-center font-semibold text-3xl mt-10">Popular Categories</h1>
        <div className="grid min-[800px]:grid-cols-3">
          {[
            { id: 1, Name: "Fast Food", image: PizzaIcon },
            { id: 2, Name: "Ice Cream", image: IceCreamBowlIcon },
            { id: 3, Name: "Dessert", image: DessertIcon },
          ].map((category) => {
            const Icon = category.image;
            return (
              <div
                key={category.id}
                className="max-w-full bg-white m-10 p-5 flex flex-col gap-y-10 items-center overflow-hidden rounded-tl-3xl rounded-br-3xl hover:scale-105 cursor-pointer duration-300 ease-in-out"
              >
                <h2 className="text-2xl font-semibold">{category.Name}</h2>
                <div>
                  <Icon size={100} className="text-orange-500" />
                </div>
              </div>
            );
          })}
        </div>

        <h2 className="mb-5 text-3xl min-[1100]:text-3xl font-semibold text-center">
          Stay <span className="text-orange-500">Home</span>, stay{" "}
          <span className="text-green-500">safe</span>.
        </h2>
        <div className="min-[800px]:flex min-[1100px]:justify-center">
          <div
            ref={sectionRef}
            className="relative min-[1100px]:right-60 p-5 min-[800px]:max-w-[50vw]"
          >
            <div className="pb-4 gap-3">
              <p>Our fast delivery services are active across the country</p>
            </div>
            <div className="flex gap-x-4 my-2">
              <BikeIcon color="green" /> <p>1000+ delivery man across the country</p>
            </div>
            <div className="flex gap-x-4 my-2">
              <Clock color="green" /> <p>Delivery within 20 minutes</p>
            </div>
          </div>

          <motion.div
            className="flex justify-center min-[800px]:justify-end"
            initial={{ x: 300 }}
            whileInView={{ x: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
          >
            <img src={deliveryBoy} alt="bike" width={200} className="" />
          </motion.div>
        </div> */}
      {/* </div> */}