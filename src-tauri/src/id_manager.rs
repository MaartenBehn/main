use serde::Serialize;

#[derive(Debug, Clone, Serialize)]
pub struct IdManager {
    counter: usize,
    free_ids: Vec<usize>,
}

impl IdManager {
    pub fn new() -> Self {
        Self {
            counter: 0,
            free_ids: Vec::new(),
        }
    }

    pub fn get_id(&mut self) -> usize {
        self.free_ids.pop().unwrap_or_else(|| -> usize {
            let new_id = self.counter;
            self.counter += 1;
            new_id
        })
    }

    pub fn free_id(&mut self, id: usize) -> bool {
        if self.free_ids.contains(&id) {
            return true;
        }

        self.free_ids.push(id);
        return false;
    }

    pub fn is_valid(&self, id: usize) -> bool {
        self.counter > id && !self.free_ids.contains(&id)
    }
}