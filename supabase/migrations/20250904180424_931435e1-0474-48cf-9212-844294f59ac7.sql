-- Add DELETE policy for partnerships table
CREATE POLICY "Users can delete their partnerships" 
ON public.partnerships 
FOR DELETE 
USING ((auth.uid() = user1_id) OR (auth.uid() = user2_id));