alias Getaways.Vacation

# Fetch 3 places we want to get the bookings for:

[place1, place2, place3] = Vacation.list_places([limit: 3])

# Create a dataloader:

loader = Dataloader.new

# Create a source which is the database repo:

source = Dataloader.Ecto.new(Getaways.Repo)

# Add the source to the data loader. The name of the source is
# arbitrary, but typically named after a Phoenix context module.
# In this case, the name is `Getaways.Vacation`.

loader = loader |> Dataloader.add_source(Vacation, source)

# Create a batch of bookings to be loaded (does not query the database):

loader =
  loader
  |> Dataloader.load(Vacation, :bookings, place1)
  |> Dataloader.load(Vacation, :bookings, place2)
  |> Dataloader.load(Vacation, :bookings, place3)

# Now query the database to retrieve all queued-up bookings as a batch:

loader = loader |> Dataloader.run

# 🔥 This runs one Ecto query to fetch all the bookings for all the places!

# Now you can get the bookings for a particular place:

loader |> Dataloader.get(Vacation, :bookings, place1) |> IO.inspect
loader |> Dataloader.get(Vacation, :bookings, place2) |> IO.inspect
loader |> Dataloader.get(Vacation, :bookings, place3) |> IO.inspect

