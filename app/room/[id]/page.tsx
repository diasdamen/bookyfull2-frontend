import Reservation from "@/components/Reservation";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import Image from "next/image";
import { TbArrowsMaximize, TbUsers } from "react-icons/tb";

import { FaWifi, FaTv, FaSwimmingPool, FaCoffee } from "react-icons/fa";

const getRoomData = async ({params} : {params: any})=> {
  const res = await fetch(
    `http://127.0.0.1:1337/api/rooms/${params.id}?populate=*`, 
    {
      next: {
        revalidate: 0,
      },
    }
  );
  return await res.json();
};


const getReservationData = async ()=> {
  const res = await fetch(
    `http://127.0.0.1:1337/api/reservations?populate=*`, 
    {
      next: {
        revalidate: 0,
      },
    }
  );
  return await res.json();
};

const RoomDetails = async ({params} : {params: any}) => {
  const room = await getRoomData({params});
  const reservations = await getReservationData();
  const {isAuthenticated, getUser} = getKindeServerSession();
  const isUserAuthenticated = await isAuthenticated();
  const userData = await getUser();

  const imgURL = `http://127.0.0.1:1337${room.data.attributes.image.data.attributes.url}`;


  // Персональные facilities для каждой комнаты
  const facilitiesMap: { [key: string]: { name: string, icon: JSX.Element }[] } = {
    "1": [
      { name: "Wi-Fi", icon: <FaWifi /> },
      { name: "Cable TV", icon: <FaTv /> },
      { name: "Breakfast", icon: <FaCoffee /> },
    ],
    "2": [
      { name: "Wi-Fi", icon: <FaWifi /> },
      { name: "Breakfast", icon: <FaCoffee /> },
      { name: "Cable TV", icon: <FaTv /> },
      { name: "Pool", icon: <FaSwimmingPool /> },
    ],
    "3": [
      { name: "Cable TV", icon: <FaTv /> },
      { name: "Wi-Fi", icon: <FaWifi /> },
      { name: "Pool", icon: <FaSwimmingPool /> },
    ],
    // Добавьте другие комнаты с их персональными facilities
  };

  // Получаем id комнаты
  const roomId = room.data.id;

  // Facilities для текущей комнаты
  const facilities = facilitiesMap[roomId] || [];
  
  return (
    <section className="min-h-[80vh]">
      <div className="container mx-auto py-8">
        <div className="flex flex-col lg:flex-row lg:gap-12 h-full">
          {/* img & text */}
          <div className="flex-1">
            {/* image */}
            <div className="relative h-[360px] lg:h-[420px] mb-8">
              <Image src={imgURL} fill className="object-cover" alt="" />
            </div>
            <div className="flex flex-1 flex-col mb-8">
              {/* title & price */}
              <div className="flex justify-between items-center mb-4">
                <h3 className="h3">{room.data.attributes.title}</h3>
                <p className="h3 font-secondary font-medium text-accent">
                  ${room.data.attributes.price}
                  <span className="text-base text-secondary">/ night</span>
                </p>
              </div>

              {/* info */}
              <div className="flex items-center gap-8 mb-4">
                <div className="flex items-center gap-2">
                  <div className="text-2xl text-accent">
                    <TbArrowsMaximize />
                  </div>
                  <p>
                    {room.data.attributes.size} m <sup>2</sup>
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-2xl text-accent">
                    <TbUsers />
                  </div>
                  <p>{room.data.attributes.capacity} Guests</p>
                </div>
              </div>

              <p>{room.data.attributes.description}</p>
            </div>
            {/* facilities */}
            <div className="mt-12">
              <h3 className="h3 mb-3">Room Facilities</h3>
              <p className="mb-12">
                Lorem, ipsum dolor sit amet consectetur adipisicing elit. Iure, obcaecati?
              </p>
              {/* grid */}
              {/* <div className="flex">
                <div className="flex">
                  <div className="text-2xl text-accent">
                    <FaWifi />
                  </div>
                  <p className="pl-2">{room.data.attributes.facility} Wi-Fi</p>
                </div>
                <div className="flex ml-10">
                  <div className="text-2xl text-accent">
                    <FaTv />
                  </div>
                  <p className="pl-2">{room.data.attributes.facility} Cable TV</p>
                </div>
                <div className="flex ml-10">
                  <div className="text-2xl text-accent">
                    <FaSwimmingPool />
                  </div>
                  <p className="pl-2">{room.data.attributes.facility} Pool</p>
                </div>
              </div> */}
              <div className="grid grid-cols-2 md:grid-cols-4 sm:grid-cols-3 gap-4 mb-12">
                {facilities.map((facility, index) => (
                  <div key={index} className="flex items-center">
                    <div className="text-2xl text-accent">
                      {facility.icon}
                    </div>
                    <p className="pl-2">{facility.name}</p>
                  </div>
                ))}
              </div>
              
              
            </div>
          </div>
          {/* reservation */}
          <div className="w-full lg:max-w-[360px] h-max">
            <Reservation 
              reservations={reservations} 
              room={room} 
              isUserAuthenticated={isUserAuthenticated} 
              userData={userData} 
            />
          </div>
        </div>
      </div>
    </section>
  )
}

export default RoomDetails;