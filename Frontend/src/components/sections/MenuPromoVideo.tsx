export function MenuPromoVideo() {
  return (
    <div className="relative w-full h-full overflow-hidden rounded-2xl bg-black">
      <iframe
        src="https://player.cloudinary.com/embed/?cloud_name=djegmn3hm&public_id=AQNaBmByVoeyiVtDYW6GSi8TwoefyWGBL74GM1MgSU9D-uUeUzL5XiUWZb30bFA46D8D_BE3DryETXgEWZ8aT8Bf31zNCQn6a5Y_ztqmex&fluid=true&autoplay=true&loop=true&controls=false&muted=true"
        allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
        allowFullScreen
        frameBorder="0"
        className="absolute top-1/2 left-1/2 h-[101%] w-[101%] -translate-x-1/2 -translate-y-1/2 pointer-events-none object-cover"
        title="Starbucks Promo Video"
      ></iframe>
    </div>
  );
}

export default MenuPromoVideo;
